<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Email Templates</h2>
            </div>
            <div>
                 <form class="panel-heading p-0" @submit.prevent="validateForm">
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
                  <td class="btn-add-email-template">
                      <button type="button" class="k-button k-secondary" @click="insert"><i class="fa fa-plus"></i>Add new</button>

                  </td>
                </tr>
              </table>
    </form>
                <Grid ref="grid" :data-items="result"
                :style="{ height: '60vh' }" 
                 :columns="columns"
                  :resizable="true"
                 :pageable="true"
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
                <dialog-container v-if="emailTemplateModel" :dialog-title="dialogTitle" :data-item="emailTemplateModel" :emailPoolNames="emailPoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteEmailTemplate" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditEmailTemplate";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "EmailTemplates",
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
        emailTemplates:[],
        selectedPoolName: undefined,
        emailPoolNames: [],
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
          title: "Template Name",
          //type: "text",
          //width: "150px" 
        },
        {
          field: "variant",
          editable: false,
          title: "Variant",
          //type: "text",
          //width: "150px" 
        },{
          field: "sender",
          editable: false,
          title: "Sender",
          //type: "text",
          //width: "150px" 
        },        
        {
          field: "messageTemplate",
          editable: false,
          title: "Message Template",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate",title: "Action" },
      ],
      emailTemplateModel: undefined,
      deleteModel: undefined,
      errors:[],
      ddlDefault: {
        id: "",
        name: "Select",
      },
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
                return this.emailTemplates.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.emailTemplateModel.id === undefined ? "Add" : "Edit"} Email Template`;
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
    async getEmailTemplates(){
        console.log("getEmailTemplates");
        try{
        const response = await axios.get(this.base_url_management + "GetEmailTemplatesByPool/"+this.selectedPoolName.id);
        if(response.data.status){
        this.emailTemplates = response.data.result;
        }else{
          this.emailTemplates = [];
        }
        this.gridDataTotal =this.emailTemplates.length;
        }catch(err){
            this.messageModel = err.response.data;
        }
    },
    async registerEmailTemplate(dataItem){
        console.log("registerEmailTemplate");
        try{
        let data = {
            name : dataItem.name,
            variant: dataItem.variant,
            sender: dataItem.sender,
            emailPoolID: dataItem.emailPoolID,
            messageTemplate: dataItem.messageTemplate
        }
        await axios.post(this.base_url_management + "addEmailtemplate",data).then((response) => {
        //e.success(response.data.status);
        this.getEmailTemplates();
        console.log(response);
      })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateEmailTemplate(dataItem){
        console.log("updateEmailTemplate");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name,
            variant: dataItem.variant,
            sender: dataItem.sender,
            emailPoolID: dataItem.emailPoolID,
            messageTemplate: dataItem.messageTemplate
        }
        await axios.post(this.base_url_management + "updateEmailTemplate",data).then((response) => {
        //e.success(response.data.status);
       this.getEmailTemplates();
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
     async deleteEmailTemplate(dataItem){
        console.log("deleteEmailTemplate");
        try{
        await axios.get(this.base_url_management + "deleteEmailtemplate/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       this.getEmailTemplates();
        console.log(response);
      })
        }catch(err){
       this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.emailTemplateModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.emailTemplateModel;
      const isNewEmailTemplate = dataItem.id == undefined;
      if (!isNewEmailTemplate) {
        this.updateEmailTemplate(dataItem);
      } else {
        this.registerEmailTemplate(dataItem);
      }
      this.emailTemplateModel = undefined;
    },
    cancelPopup() {
      this.emailTemplateModel = undefined;
    },
    insert() {
      this.emailTemplateModel = {};
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
            this.getEmailTemplates();
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
.btn-add-email-template{
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
