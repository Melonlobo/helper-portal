<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">SMS Channels</h2>
            </div>
            <div>
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
                              v-model="smsPoolName"
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
                      <td class="btn-add-sms-channel">
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
                <dialog-container v-if="smsChannelModel" :dialog-title="dialogTitle" :data-item="smsChannelModel" :smsPoolNames="smsPoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteSMSChannel" @cancel="cancelConfirmation"></confirmation-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditSMSChannel.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"

export default ({
    name: "SMSChannels",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         dropdownlist: DropDownList, 
         "custom-command-cell": CommandCell,
         "error-popup":ErrorPopup,
         "confirmation-popup": ConfirmationPopup   
    },
    data() {
      return {
       base_url: this.$config.smsApiUrl,
       base_url_management:this.$config.smsApiManagementUrl,
        smsChannels:[],
        gridDataTotal:0,
         skip:0,
        take:10,
        pageSize:10,
        smsPoolNames: undefined,
        smsPoolName: undefined,
        errors: [],
        selectedPoolName: undefined,
        selectedProviderName: undefined,
        ddlDefault: {
        id: "",
        name: "Select",
      },
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "key",
          editable: false,
          title: "Channel Key",
          //type: "text",
          //width: "150px" 
        },{
          field: "smsPoolName",
          editable: false,
          title: "Pool Name",
          //type: "text",
          //width: "150px" 
        },{
          field: "smsProviderName",
          editable: false,
          title: "Provider Name",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      smsChannelModel: undefined,
      deleteModel: undefined
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
                return this.smsChannels.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.smsChannelModel.id === undefined ? "Add" : "Edit"} SMS Channel`;
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
            console.log(err)
        }
    },
    async getSMSChannels(){
        console.log("getSMSChannels");
        try{
        const response = await axios.get(this.base_url_management + "GetSMSChannelsByPool/"+this.selectedPoolName.id);
        if(response.data.status){
        this.smsChannels = response.data.result;
        }else{
            this.smsChannels = [];
        }
        this.gridDataTotal =this.smsChannels.length;
        }catch(err){
            console.log(err)
        }
    },
    async registerSMSChannel(dataItem){
        console.log("registerSMSChannel");
        let data = {
            key : dataItem.key,
            smsPoolID: dataItem.smsPoolID,
            smsProviderID: dataItem.smsProviderID,
            monthlyQuota : 0,
            totalQuota: 0,
            isRestrictedByQuota: false
        }
        await axios.post(this.base_url_management + "addSMSChannel",data).then((response) => {
        //e.success(response.data.status);
        if(this.selectedPoolName != undefined){
        this.getSMSChannels();
        }
        console.log(response);
      })
    },
    async updateSMSChannel(dataItem){
        console.log("updateSMSChannel");
        try{
            let data = {
                id: dataItem.id,
                key : dataItem.key,
                smsPoolID: dataItem.smsPoolID,
                smsProviderID: dataItem.smsProviderID,
                monthlyQuota : 0,
                totalQuota: 0,
                isRestrictedByQuota: true
            }
        await axios.post(this.base_url_management + "updateSMSChannel",data).then((response) => {
        //e.success(response.data.status);
       if(this.selectedPoolName != undefined){
        this.getSMSChannels();
        }
        console.log(response);
      })
        }
        catch(err){
            console.log(err)
        }
    },
     async deleteSMSChannel(dataItem){
        console.log("deleteSMSChannel");
        try{
        await axios.get(this.base_url_management + "deleteSMSChannel/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       if(this.selectedPoolName != undefined){
        this.getSMSChannels();
        }
        console.log(response);
      })
        }catch(err){
        console.log(err)
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.smsChannelModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.smsChannelModel;
      const isNewSMSChannel = dataItem.id == undefined;
      if (!isNewSMSChannel) {
        this.updateSMSChannel(dataItem);
      } else {
        this.registerSMSChannel(dataItem);
      }
      this.smsChannelModel = undefined;
    },
    cancelPopup() {
      this.smsChannelModel = undefined;
    },
    insert() {
      this.smsChannelModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    onChangePoolName(event){
         this.selectedPoolName = event.target.value;        
    },
    validateForm(e){
        if(this.selectedPoolName != undefined && this.selectedPoolName.name == "Select"){
            this.selectedPoolName = undefined
        }
        if(this.selectedPoolName){
            this.getSMSChannels();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.selectedPoolName) {
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
    }
})
</script>

<style scoped>
.btn-add-sms-channel{
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


