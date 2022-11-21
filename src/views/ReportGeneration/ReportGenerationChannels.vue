<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Report Channels</h2>
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
                      <td class="btn-add-report-gen-channel">
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
                <dialog-container v-if="reportGenerationChannelModel" :dialog-title="dialogTitle" :data-item="reportGenerationChannelModel" :reportGenerationPoolNames="this.reportGenerationPoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteReportGenerationChannel" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditReportGenerationChannel.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "ReportGenerationChannels",
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
       base_url: this.$config.reportApiUrl,
       base_url_management:this.$config.reportApiManagementUrl,
       gridDataTotal:0,
         skip:0,
        take:10,
        pageSize:10,
        messageModel: undefined,
        reportGenerationChannels:[],
        reportGenerationPoolNames: undefined,
        reportGenerationPoolName: undefined,
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
          field: "poolName",
          editable: false,
          title: "Pool Name",
          //type: "text",
          //width: "150px" 
        },{
          field: "providerName",
          editable: false,
          title: "Provider Name",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      reportGenerationChannelModel: undefined,
      deleteModel: undefined,
    };
    },
    beforeMount: function() {
        this.getReportGenerationPoolNames()
        console.log(this.reportGenerationPoolNames);
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
        result: {
            get: function() {
                return this.reportGenerationChannels.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.reportGenerationChannelModel.id === undefined ? "Add" : "Edit"} Report Channel`;
        }
    },
    methods: {
         pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
     async getReportGenerationPoolNames(){
        try{
        const response = await axios.get(this.base_url_management + "GetPoolNames");
        this.reportGenerationPoolNames = response.data.result;
        console.log(this.reportGenerationPoolNames);
        }catch(err){
            console.log(err)
        }
    },
    async getReportGenerationChannels(){
        console.log("getReportGenerationChannels");
        try{
        const response = await axios.get(this.base_url_management + "GetChannelsByPool/"+this.selectedPoolName.id);
        if(response.data.status){
        this.reportGenerationChannels = response.data.result;
        }else{
          this.reportGenerationChannels = [];
        }
         this.gridDataTotal =this.reportGenerationChannels.length;
        }catch(err){
           this.messageModel = err.response.data;
        }
    },
    async registerReportGenerationChannel(dataItem){
        console.log("registerReportGenerationChannel");
        try{
        let data = {
            key : dataItem.key,
            poolID: dataItem.poolID,
            providerID: dataItem.providerID
        }
        await axios.post(this.base_url_management + "addChannel",data).then((response) => {
        //e.success(response.data.status);
        if(this.selectedPoolName != undefined){
        this.getReportGenerationChannels();
        }
        console.log(response);
      })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateReportGenerationChannel(dataItem){
        console.log("updateReportGenerationChannel");
        try{
            let data = {
                id: dataItem.id,
                key : dataItem.key,
                poolID: dataItem.poolID,
                providerID: dataItem.providerID
            }
        await axios.post(this.base_url_management + "updateChannel",data).then((response) => {
        //e.success(response.data.status);
       if(this.selectedPoolName != undefined){
        this.getReportGenerationChannels();
        }
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
     async deleteReportGenerationChannel(dataItem){
        console.log("deleteReportGenerationChannel");
        try{
        await axios.get(this.base_url_management + "deleteChannel/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       if(this.selectedPoolName != undefined){
        this.getReportGenerationChannels();
        }
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.reportGenerationChannelModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.reportGenerationChannelModel;
      const isNewChannel = dataItem.id == undefined;
      if (!isNewChannel) {
        this.updateReportGenerationChannel(dataItem);
      } else {
        this.registerReportGenerationChannel(dataItem);
      }
      this.reportGenerationChannelModel = undefined;
    },
    cancelPopup() {
      this.reportGenerationChannelModel = undefined;
    },
    insert() {
      this.reportGenerationChannelModel = {};
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
            this.getReportGenerationChannels();
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
.btn-add-report-gen-channel{
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


