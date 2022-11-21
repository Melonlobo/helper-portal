<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">SMS Templates</h2>
            </div>
            <div>
              <form class="panel-heading p-0" @submit.prevent="validateForm">
                <div class="table-responsive">
                  <table class="table mb-0 text-left sm-font">
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
                    <td class="btn-add-sms-template">
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
                <dialog-container v-if="smsTemplateModel" :dialog-title="dialogTitle" :data-item="smsTemplateModel" :smsPoolNames="smsPoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteSMSTemplate" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditSMSTemplate";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "SMSTemplates",
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
      base_url: this.$config.smsApiUrl,
       base_url_management:this.$config.smsApiManagementUrl,
        smsTemplates:[],
         messageModel: undefined,
        gridDataTotal:0,
           skip:0,
        take:10,
        pageSize:10,
        selectedPoolName: undefined,
        smsPoolNames: [],
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
      smsTemplateModel: undefined,
      deleteModel:undefined,
      errors:[],
      ddlDefault: {
        id: "",
        name: "Select",
      },
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
                return this.smsTemplates.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.smsTemplateModel.id === undefined ? "Add" : "Edit"} SMS Template`;
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
    async getSMSTemplates(){
        console.log("getSMSTemplates");
        try{
        const response = await axios.get(this.base_url_management + "GetSMSTemplatesByPool/"+this.selectedPoolName.id);
        if(response.data.status){
        this.smsTemplates = response.data.result;
        }else{
          this.smsTemplates = [];
        }
        this.gridDataTotal =this.smsTemplates.length;
        }catch(err){
             this.messageModel = err.response.data;
        }
    },
    async registerSMSTemplate(dataItem){
        console.log("registerSMSTemplate");
        try{
        let data = {
            name : dataItem.name,
            variant: dataItem.variant,
            sender: dataItem.sender,
            smsPoolID: dataItem.smsPoolID,
            messageTemplate: dataItem.messageTemplate
        }
        await axios.post(this.base_url_management + "addSMStemplate",data).then((response) => {
        //e.success(response.data.status);
        this.getSMSTemplates();
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
    async updateSMSTemplate(dataItem){
        console.log("updateSMSTemplate");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name,
            variant: dataItem.variant,
            sender: dataItem.sender,
            smsPoolID: dataItem.smsPoolID,
            messageTemplate: dataItem.messageTemplate
        }
        await axios.post(this.base_url_management + "updateSMSTemplate",data).then((response) => {
        //e.success(response.data.status);
       this.getSMSTemplates();
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
     async deleteSMSTemplate(dataItem){
        console.log("deleteSMSTemplate");
        try{
        await axios.get(this.base_url_management + "deleteSMStemplate/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       this.getSMSTemplates();
        console.log(response);
      })
        }catch(err){
         this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.smsTemplateModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.smsTemplateModel;
      const isNewSMSTemplate = dataItem.id == undefined;
      if (!isNewSMSTemplate) {
        this.updateSMSTemplate(dataItem);
      } else {
        this.registerSMSTemplate(dataItem);
      }
      this.smsTemplateModel = undefined;
    },
    cancelPopup() {
      this.smsTemplateModel = undefined;
    },
    insert() {
      this.smsTemplateModel = {};
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
            this.getSMSTemplates();
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
.btn-add-sms-template{
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
