<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">SMS Providers</h2>
            </div>
            <div>
                <!-- <div class="row">
                    <button title="Add new" class="m-2 k-button k-primary" @click="insert"><i class="fa fa-plus mr-2"></i>Add new</button>
                </div> -->
                <form class="panel-heading p-0" @submit.prevent="validateForm">
                  <div class="table-responsive">
                    <table class="table mb-0 sm-font text-left">
                      <tr>
                      <td class="custom-table-cell">
                          <label>Pool Name<span class="c-danger">*</span></label>
                      </td>
                      <td> 
                            <dropdownlist
                             :style="{'font-size': '12px'}"
                              :data-items="smsPoolNames"      
                              :default-item="ddlDefault"   
                          :text-field="'name'"
                              :data-item-id="'id'" 
                              v-model="smspoolName"
                              @change="onChangePoolName">
                            </dropdownlist>
                      </td>
                      <td class="custom-table-cell">
                        <button
                type="submit"
                value="Search"
      class="k-button k-secondary mr-4"
              
              >
                <i class="fa fa-search" aria-hidden="true"></i> Search
              </button>
                      </td>
                      <td class="btn-add-sms-provider">
                          <button type="button" class="k-button k-secondary" @click="insert"><i class="fa fa-plus"></i>Add new</button>

                      </td>
                    </tr>
                    </table>
                  </div>
                </form>
                <Grid ref="grid" :data-items="result"
                :style="{ height: '60vh' }" 
                 :columns="columns"
                 :pageable="true"
                 :total="gridDataTotal"
                  :resizable="true"
                    :page-size="pageSize"
                  :skip="skip"
                  :take="take"
                  @pagechange="pageChangeHandler"
                >
                   <template v-slot:customCommandTemplate="{props}">
                        <custom-command-cell :data-item="props.dataItem" 
                        @edit="edit"
                        @remove="confirmDeletePopup"/>
                    </template>
                </Grid>
                <dialog-container v-if="smsProviderModel" :dialog-title="dialogTitle" :data-item="smsProviderModel" :smsPoolNames="smsPoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteSMSProvider" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditSMSProviders.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue";
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "SMSProviders",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
         dropdownlist: DropDownList,
          "error-popup":ErrorPopup,
         "confirmation-popup": ConfirmationPopup ,
         "message-popup":MessagePopup     
    },
    data() {
      return {
     base_url: this.$config.smsApiUrl,
       base_url_management:this.$config.smsApiManagementUrl,
        smsProviders:[],
        messageModel: undefined,
        smsPoolNames: undefined,
        smspoolName: undefined,
        gridDataSource:0,
          skip:0,
        take:10,
        pageSize:10,
        gridDataTotal:undefined,
        errors: [],
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "name",
          editable: false,
          title: "SMS Provider Name",
          //type: "text",
          //width: "150px" 
        },{
          field: "type",
          editable: false,
          title: "Type",
          //type: "text",
          //width: "150px" 
        },{
          field: "configuration",
          editable: false,
          title: "Configuration",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
       ddlDefault: {
        id: "",
        name: "Select",
      },
      smsProviderModel: undefined,
      deleteModel:undefined
    };
    },
    beforeMount: function() {
        this.getSMSPoolNames()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
       result: {
            get: function() {
                return this.smsProviders.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.smsProviderModel.id === undefined ? "Add" : "Edit"} SMS Provider`;
        }
    },
    methods: {
        pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getSMSPoolNames(){
        try{
        const response = await axios.get(this.base_url_management + "GetSMSPoolNames");
        this.smsPoolNames = response.data.result;
        }catch(err){
           this.messageModel = err.response.data;
        }
    }, 
    onChangePoolName(event){
         this.smsPoolName = event.target.value;        
    },
    async getSMSProviders(){
        console.log("getSMSProviders");
        try{
        const response = await axios.get(this.base_url_management + "GetSMSProviders/"+ this.smspoolName.id);
        if(response.data.status){
        this.smsProviders = response.data.result;
        }else{
          this.smsProviders = [];
        }
        this.gridDataTotal =this.smsProviders.length;
        }catch(err){
           this.messageModel = err.response.data;
        }
    },
    async registerSMSProvider(dataItem){
        console.log("registerSMSProvider");
        try{
        let data = {
            name : dataItem.name,
            type: dataItem.type,
            configuration: dataItem.configuration,
            smsPoolID: dataItem.smsPoolName
        }
        await axios.post(this.base_url_management + "addSMSProvider",data).then((response) => {
        //e.success(response.data.status);
        if(this.smspoolName != undefined){
       this.getSMSProviders();
        }
        console.log(response);
      })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateSMSProvider(dataItem){
        console.log("updateSMSProvider");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name,
            type: dataItem.type,
            configuration: dataItem.configuration,
            smsPoolName: dataItem.smsPoolName,
            smsPoolID: dataItem.smsPoolID
        }
        await axios.post(this.base_url_management + "updateSMSProvider",data).then((response) => {
        //e.success(response.data.status);
        if(this.smspoolName != undefined){
       this.getSMSProviders();
        }
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
     async deleteSMSProvider(dataItem){
        console.log("deleteSMSProvider");
        try{
        await axios.get(this.base_url_management + "DeleteSMSProvider/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       if(this.smspoolName != undefined){
       this.getSMSProviders();
        }
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.smsProviderModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.smsProviderModel;
      const isNewSMSProvider = dataItem.id == undefined;
      if (!isNewSMSProvider) {
        this.updateSMSProvider(dataItem);
      } else {
        this.registerSMSProvider(dataItem);
      }
      this.smsProviderModel = undefined;
    },
    cancelPopup() {
      this.smsProviderModel = undefined;
    },
    insert() {
      this.smsProviderModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    validateForm(e){
        if(this.smspoolName != undefined && this.smspoolName.name == "Select"){
            this.smspoolName = undefined
        }
        if(this.smspoolName){
            this.getSMSProviders();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.smspoolName) {
        this.errors.push('Please select a Pool Name.');
      }

      e.preventDefault();
    },
    errorPopupOk(){
      this.errors = [];
    },
    confirmDeletePopup(dataItem){
      this.deleteModel = this.cloneProduct(dataItem);
    },
    cancelConfirmation(){
      this.deleteModel = undefined;
    },
     messagePopupOk(){
        this.messageModel = undefined;
    }
    }
})
</script>
<style scoped>
.btn-add-sms-provider{
  text-align: right;
  width: 905px
}

.custom-table-cell{
width: 145px;
padding-right: 10px;
}

p{
  margin-bottom: 0px!important;
}
</style>
