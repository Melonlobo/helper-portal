<template>
    <div class="auditEntities">
        <div class="container-fluid">
          <div class="panel-heading">
          <h2 class="text-left">Audit Entities</h2>
          </div>
            <form class="panel-heading p-0" @submit.prevent="validateForm">
              <div class="table-responsive">
              <table class="table mb-0 text-left sm-font">
                <colgroup>
                  <col span="1" class="table-column-width" />
                  <col span="1" class="table-column-width" />
                  <col span="1" class="table-column-width" />
                  <col span="1" class="table-column-width" />
                </colgroup>
                <tr>
                  <td>
                      <label>Application Key<span class="c-danger">*</span></label>
                  </td>
                  <td> 
                        <dropdownlist
                        :style="{'font-size': '12px'}"
                          :data-items="applicationKeys"   
                          :default-item="ddlDefault"       
                          :text-field="'key'"
                          :data-item-id="'id'"  
                          v-model="selectedAppKey"
                          @change="onChangeApplicationKey">
                        </dropdownlist>
                  </td>
                  <td>
                    <button
            type="submit"
            value="Search"
            class="k-button k-secondary mr-4"
          >
            <i class="fa fa-search" aria-hidden="true"></i> Search
          </button>
                  </td>
                  <td class="btn-add-audit">
                      <button type="button" class="k-button k-secondary" @click="insert"><i class="fa fa-plus"></i>Add new</button>

                  </td>
                </tr>
              </table>
              </div>
    </form>
        <div>
            <Grid
        ref="grid" id="auditEntitiesGrid"
        :style="{ height: '58vh' }"
        :data-items="result"
        :no-records="true"
        :pageable="true"
        :page-size="pageSize"
        :skip="skip"
        :take="take"
        @pagechange="pageChangeHandler"
         :resizable="true"
         :total="gridDataTotal"
        :columns="columns">
         <template v-slot:commandCellTemplate="{props}">
          <customCommandCell :data-item="props.dataItem" @edit="edit" @remove="confirmDeletePopup" />
        </template>
        </Grid>
        <dialog-container v-if="auditEntityModel" :dialog-title="dialogTitle" :data-item="auditEntityModel" :applicationKeys="applicationKeys" @save="save" @cancel="cancel">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteAuditEntity" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
        </div>
        </div>
    </div>
</template>
<script>
import { Grid } from "@progress/kendo-vue-grid";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import CommandCell from "../shared/CommandCell.vue";
import DialogContainer from "./AddEditAuditEntities";
import ErrorPopup from "../shared/ErrorPopup.vue";
import axios from "axios";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue";
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "AuditEntities",
    components: {
         Grid: Grid,
        dropdownlist: DropDownList,
        "dialog-container": DialogContainer,
        "customCommandCell": CommandCell,
        "error-popup":ErrorPopup,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup
    },
    beforeMount: function(){
        this.getApplicationKeys();
    },
    mounted:function(){
    },
    computed: {
      result: {
            get: function() {
                return this.auditEntities.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.auditEntityModel.id === undefined ? "Add" : "Edit"} Audit Entities`;
        }
    },
    data() {
      return {
        base_url: this.$config.auditLogApiUrl,
       base_url_management:this.$config.auditLogApiManagementUrl,
       gridDataTotal: 0,
       skip:0,
        take:10,
        pageSize:10,
       messageModel:undefined,
      selectedAppKey: undefined,
      errors: [],
      auditEntities: [],
      applicationKeys: [],
      entityNames: [],
      entityName: undefined,
      auditEntityModel: undefined,
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "entityName",
          editable: false,
          title: "Entity Name"
        },{
          field: "fields",
          editable: false,
          title: "Fields"
        },{
          field: "applicationKey",
          editable: false,
          title: "Application Key"
        },
        { cell: "commandCellTemplate" },
      ],
      ddlDefault: {
        id: "",
        key: "Select",
        entityName: "Select",
      },
      deleteModel: undefined,
    };
    },
    methods:{
      pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
        async getAuditEntities() {
      //this.selectedAppKey = this.tempAppKey.id;
      try {
        axios.get(
          this.base_url_management + "GetAuditLogSettings/"+this.selectedAppKey.id).then((response) => {  
              if(response.data.result != null){
              this.auditEntities=response.data.result;        
              }else{
                this.auditEntities = []
              }
              this.gridDataTotal = this.auditEntities.length;
        });
      } catch (err) {
        this.messageModel = err.response.data;
      }
    },
        async getApplicationKeys() {
      try {
        await axios.get(
          this.base_url_management + "GetApplicationKeys").then((response) => {
            if(response.data.result != null){
                      this.applicationKeys=response.data.result;
            }
        console.log(response.data.result);
        });
      } catch (err) {
        this.messageModel = err.response.data;
      }
    },
    onChangeApplicationKey(event) {
     this.selectedAppKey = event.target.value;
    },
    async configureAuditEntity(dataItem){
        console.log("configureAuditEntity");
        try{
        var stringList = dataItem.fields.split(",").filter(d => d != "" && d != " ");
        console.log(stringList);
        dataItem.applicationId = dataItem.applicationId == undefined ? dataItem.applicationKey : dataItem.applicationId;
       const response = await axios.post(this.base_url_management + "configureAuditEntity/"+dataItem.applicationId+"/"+dataItem.entityName, stringList);
       if(response.data.status){
          if(this.selectedAppKey != undefined){
           this.getAuditEntities()
          }
       }   
        }
        catch(err){
          this.messageModel = err.response.data;
        }  
    },
    validateForm(e){
        if(this.selectedAppKey != undefined && this.selectedAppKey.Name == "Select"){
            this.selectedAppKey = undefined
        }
        if(this.selectedAppKey){
            this.getAuditEntities();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.selectedAppKey) {
        this.errors.push('Please select an Application Key.');
      }

      e.preventDefault();
    },
    async deleteAuditEntity(dataItem){
       console.log("DeleteAuditEntity");
       try{
        const response = await axios.get(this.base_url_management + "DeleteAuditEntity/"+dataItem.id);
      if(response.data.status){
          if(this.selectedAppKey != undefined){
           this.getAuditEntities()
          }
       }
       }
       catch(err){
         this.messageModel = err.response.data;
       }
       this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.auditEntityModel = this.cloneProduct(dataItem);
    },
    save() {
      const dataItem = this.auditEntityModel;
      this.configureAuditEntity(dataItem);
      this.auditEntityModel = undefined;
     
    },
    cancel() {
      this.auditEntityModel = undefined;
    },
    insert() {
      console.log("in insert")
      console.log(this.applicationKeys)
      this.auditEntityModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
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
td{
  border:0;
  padding:0.5rem ;
}
.btn-add-audit{
  text-align: right;
  width: 650px
}

p {
    margin-bottom: 0!important;
}

.label-margin{
  margin-left: 10px;
  margin-right: 10px;
}

.label-margin-first{
  margin-right: 10px;
}

.table-column-width{
  width: 136px;
}
</style>
