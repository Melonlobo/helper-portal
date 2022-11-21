<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Report Providers</h2>
            </div>
            <div>
                <!-- <div class="row">
                    <button title="Add new" class="m-2 k-button k-primary" @click="insert"><i class="fa fa-plus mr-2"></i>Add new</button>
                </div> -->
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
                          :data-items="reportGenerationPoolNames"      
                           :default-item="ddlDefault"   
                      :text-field="'name'"
                          :data-item-id="'id'" 
                          v-model="reportGenerationPoolName"
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
                  <td class="btn-add-report-gen-provider">
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
                <dialog-container v-if="reportGenerationProviderModel" :dialog-title="dialogTitle" :data-item="reportGenerationProviderModel" :reportGenerationPoolNames="reportGenerationPoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteReportGenerationProvider" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditReportGenerationProviders.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "ReportGenerationProviders",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
         dropdownlist: DropDownList, 
         "error-popup":ErrorPopup,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup       
    },
    data() {
      return {
    base_url: this.$config.reportApiUrl,
       base_url_management:this.$config.reportApiManagementUrl,
        reportGenerationProviders:[],
        reportGenerationPoolNames: undefined,
        reportGenerationPoolName: undefined,
        errors: [],
         messageModel: undefined,
        gridDataTotal:0,
         skip:0,
        take:10,
        pageSize:10,
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "name",
          editable: false,
          title: "Provider Name",
          //type: "text",
          //width: "150px" 
        },{
          field: "dbType",
          editable: false,
          title: "Type",
          //type: "text",
          //width: "150px" 
        },{
          field: "connectionString",
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
      reportGenerationProviderModel: undefined,
      deleteModel: undefined
    };
    },
    beforeMount: function() {
        this.getreportGenerationPoolNames()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
       result: {
            get: function() {
                return this.reportGenerationProviders.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.reportGenerationProviderModel.id === undefined ? "Add" : "Edit"} Report Provider`;
        }
    },
    methods: {
         pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getreportGenerationPoolNames(){
try{
        const response = await axios.get(this.base_url_management + "GetPoolNames");
        this.reportGenerationPoolNames = response.data.result;
        }catch(err){
              this.messageModel = err.response.data;
        }
    }, 
    onChangePoolName(event){
         this.reportGenerationPoolName = event.target.value;        
    },
    async getreportGenerationProviders(){
        console.log("getreportGenerationProviders");
        try{
        const response = await axios.get(this.base_url_management + "GetProviders/"+ this.reportGenerationPoolName.id);
        if(response.data.status){
        this.reportGenerationProviders = response.data.result;
        }else{
          this.reportGenerationProviders = [];
        }
        this.gridDataTotal =this.reportGenerationProviders.length;
        }catch(err){
             this.messageModel = err.response.data;
        }
    },
    async registerReportGenerationProvider(dataItem){
        console.log("registerReportGenerationProvider");
        try{
        let data = {
            name : dataItem.name,
            dbType: dataItem.dbType,
            connectionString: dataItem.connectionString,
            PoolID: dataItem.poolName
        }
        await axios.post(this.base_url_management + "addProvider",data).then((response) => {
        //e.success(response.data.status);
        if(this.reportGenerationPoolName != undefined){
       this.getreportGenerationProviders();
        }
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
    async updateReportGenerationProvider(dataItem){
        console.log("updateReportGenerationProvider");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name,
            dbType: dataItem.dbType,
           connectionString: dataItem.connectionString,
            PoolName: dataItem.poolName,
            PoolID: dataItem.poolID
        }
        await axios.post(this.base_url_management + "updateProvider",data).then((response) => {
        //e.success(response.data.status);
        if(this.reportGenerationPoolName != undefined){
       this.getreportGenerationProviders();
        }
        console.log(response);
      })
        }
        catch(err){
             this.messageModel = err.response.data;
        }
    },
     async deleteReportGenerationProvider(dataItem){
        console.log("deleteReportGenerationProvider");
        try{
        await axios.get(this.base_url_management + "deleteProvider/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       if(this.reportGenerationPoolName != undefined){
       this.getreportGenerationProviders();
        }
        console.log(response);
      })
        }catch(err){
          this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.reportGenerationProviderModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.reportGenerationProviderModel;
      const isNewProvider = dataItem.id == undefined;
      if (!isNewProvider) {
        this.updateReportGenerationProvider(dataItem);
      } else {
        this.registerReportGenerationProvider(dataItem);
      }
      this.reportGenerationProviderModel = undefined;
    },
    cancelPopup() {
      this.reportGenerationProviderModel = undefined;
    },
    insert() {
      this.reportGenerationProviderModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    validateForm(e){
        if(this.reportGenerationPoolName != undefined && this.reportGenerationPoolName.name == "Select"){
            this.reportGenerationPoolName = undefined
        }
        if(this.reportGenerationPoolName){
            this.getreportGenerationProviders();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.reportGenerationPoolName) {
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
.btn-add-report-gen-provider{
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
