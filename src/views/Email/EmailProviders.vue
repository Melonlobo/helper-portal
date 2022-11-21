<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Email Providers</h2>
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
                              :data-items="emailPoolNames"      
                              :default-item="ddlDefault"   
                          :text-field="'name'"
                              :data-item-id="'id'" 
                              v-model="emailpoolName"
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
                      <td class="btn-add-email-provider">
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
                  :resizable="true"
                 :total="gridDataTotal"
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
                <dialog-container v-if="emailProviderModel" :dialog-title="dialogTitle" :data-item="emailProviderModel" :emailPoolNames="emailPoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteEmailProvider" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditEmailProviders.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "EmailProviders",
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
     base_url: this.$config.emailApiUrl,
       base_url_management:this.$config.emailApiManagementUrl,
        emailProviders:[],
        emailPoolNames: undefined,
        emailpoolName: undefined,
        errors: [],
        gridDataTotal:0,
            skip:0,
        take:10,
        pageSize:10,
        messageModel: undefined,
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "name",
          editable: false,
          title: "Email Provider Name",
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
      emailProviderModel: undefined,
      deleteModel: undefined
    };
    },
    beforeMount: function() {
        this.getEmailPoolNames()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
       result: {
            get: function() {
                return this.emailProviders.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.emailProviderModel.id === undefined ? "Add" : "Edit"} Email Provider`;
        }
    },
    methods: {
        pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getEmailPoolNames(){
try{
        const response = await axios.get(this.base_url_management + "GetEmailPoolNames");
        this.emailPoolNames = response.data.result;
        }catch(err){
            this.messageModel = err.response.data;
        }
    }, 
    onChangePoolName(event){
         this.emailPoolName = event.target.value;        
    },
    async getEmailProviders(){
        console.log("getEmailProviders");
        try{
        const response = await axios.get(this.base_url_management + "GetEmailProviders/"+ this.emailpoolName.id);
        if(response.data.status){
        this.emailProviders = response.data.result;
        }else{
          this.emailProviders = [];
        }
        this.gridDataTotal =this.emailProviders.length;
        }catch(err){
           this.messageModel = err.response.data;
        }
    },
    async registerEmailProvider(dataItem){
        console.log("registerEmailProvider");
        try{
        let data = {
            name : dataItem.name,
            type: dataItem.type,
            configuration: dataItem.configuration,
            emailPoolID: dataItem.emailPoolName
        }
        await axios.post(this.base_url_management + "addEmailProvider",data).then((response) => {
        //e.success(response.data.status);
        if(this.emailpoolName != undefined){
       this.getEmailProviders();
        }
      })
        }
        catch(err){
             this.messageModel = err.response.data;
        }
    },
    async updateEmailProvider(dataItem){
        console.log("updateEmailProvider");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name,
            type: dataItem.type,
            configuration: dataItem.configuration,
            emailPoolName: dataItem.emailPoolName,
            emailPoolID: dataItem.emailPoolID
        }
        await axios.post(this.base_url_management + "updateEmailProvider",data).then((response) => {
        //e.success(response.data.status);
        if(this.emailpoolName != undefined){
       this.getEmailProviders();
        }
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
     async deleteEmailProvider(dataItem){
        console.log("deleteEmailProvider");
        try{
        await axios.get(this.base_url_management + "DeleteEmailProvider/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       if(this.emailpoolName != undefined){
       this.getEmailProviders();
        }
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.emailProviderModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.emailProviderModel;
      const isNewEmailProvider = dataItem.id == undefined;
      if (!isNewEmailProvider) {
        this.updateEmailProvider(dataItem);
      } else {
        this.registerEmailProvider(dataItem);
      }
      this.emailProviderModel = undefined;
    },
    cancelPopup() {
      this.emailProviderModel = undefined;
    },
    insert() {
      this.emailProviderModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    validateForm(e){
        if(this.emailpoolName != undefined && this.emailpoolName.name == "Select"){
            this.emailpoolName = undefined
        }
        if(this.emailpoolName){
            this.getEmailProviders();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.emailpoolName) {
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
.btn-add-email-provider{
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
