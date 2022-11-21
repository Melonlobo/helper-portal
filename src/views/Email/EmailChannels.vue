<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Email Channels</h2>
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
                          :data-items="emailPoolNames"   
                          :default-item="ddlDefault"   
                      :text-field="'name'"
                          :data-item-id="'id'"         
                          v-model="emailPoolName"
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
                  <td class="btn-add-email-channel">
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
                <dialog-container v-if="emailChannelModel" :dialog-title="dialogTitle" :data-item="emailChannelModel" :emailPoolNames="emailPoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteEmailChannel" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditEmailChannel.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue";
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "EmailChannels",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         dropdownlist: DropDownList, 
         "custom-command-cell": CommandCell,
         "error-popup":ErrorPopup,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup         
    },
    data() {
      return {
      base_url: this.$config.emailApiUrl,
       base_url_management:this.$config.emailApiManagementUrl,
       gridDataTotal: 0,
         skip:0,
        take:10,
        pageSize:10,
       messageModel:undefined,
        emailChannels:[],
        emailPoolNames: undefined,
        emailPoolName: undefined,
        errors: [],
        selectedPoolName: undefined,
        selectedProviderName: undefined,
        deleteModel: undefined,
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
          field: "emailPoolName",
          editable: false,
          title: "Pool Name",
          //type: "text",
          //width: "150px" 
        },{
          field: "emailProviderName",
          editable: false,
          title: "Provider Name",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      emailChannelModel: undefined
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
                return this.emailChannels.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.emailChannelModel.id === undefined ? "Add" : "Edit"} Email Channel`;
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
    async getEmailChannels(){
        console.log("getEmailChannels");
        try{
        const response = await axios.get(this.base_url_management + "GetEmailChannelsByPool/"+this.selectedPoolName.id);
        if(response.data.status){
        this.emailChannels = response.data.result;
        }else{
          this.emailChannels = [];
        }
         this.gridDataTotal =this.emailChannels.length;
        }catch(err){
            this.messageModel = err.response.data;
        }
    },
    async registerEmailChannel(dataItem){
        console.log("registerEmailChannel");
        try{
        let data = {
            key : dataItem.key,
            emailPoolID: dataItem.emailPoolID,
            emailProviderID: dataItem.emailProviderID,
            monthlyQuota : 0,
            totalQuota: 0,
            isRestrictedByQuota: false
        }
        await axios.post(this.base_url_management + "addEmailChannel",data).then((response) => {
        //e.success(response.data.status);
        if(this.selectedPoolName != undefined){
        this.getEmailChannels();
        }
        console.log(response);
      })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateEmailChannel(dataItem){
        console.log("updateEmailChannel");
        try{
            let data = {
                id: dataItem.id,
                key : dataItem.key,
                emailPoolID: dataItem.emailPoolID,
                emailProviderID: dataItem.emailProviderID,
                monthlyQuota : 0,
                totalQuota: 0,
                isRestrictedByQuota: true
            }
        await axios.post(this.base_url_management + "updateEmailChannel",data).then((response) => {
        //e.success(response.data.status);
       if(this.selectedPoolName != undefined){
        this.getEmailChannels();
        }
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
     async deleteEmailChannel(dataItem){
        console.log("deleteEmailChannel");
        try{
        await axios.get(this.base_url_management + "deleteEmailChannel/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       if(this.selectedPoolName != undefined){
        this.getEmailChannels();
        }
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.emailChannelModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.emailChannelModel;
      const isNewEmailChannel = dataItem.id == undefined;
      if (!isNewEmailChannel) {
        this.updateEmailChannel(dataItem);
      } else {
        this.registerEmailChannel(dataItem);
      }
      this.emailChannelModel = undefined;
    },
    cancelPopup() {
      this.emailChannelModel = undefined;
    },
    insert() {
      this.emailChannelModel = {};
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
            this.getEmailChannels();
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
    messagePopupOk(){
        this.messageModel = undefined;
    }
    }
})
</script>

<style scoped>
.btn-add-email-channel{
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


