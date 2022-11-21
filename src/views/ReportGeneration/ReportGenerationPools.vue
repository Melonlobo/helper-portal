<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Report Pools</h2>
            <button title="Add new" class="k-button k-secondary btn-heading" @click="insert"><i class="fa fa-plus"></i>Add new</button>
            </div>
            <div>
                <Grid ref="grid" :data-items="result"
                :style="{ height: '67vh', width: '100%' }" 
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
                <dialog-container v-if="reportGenerationPoolModel" :dialog-title="dialogTitle" :data-item="reportGenerationPoolModel" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteReportGenerationPool" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditReportGenerationPool.vue";
import CommandCell from "../shared/CommandCell.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "ReportPools",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup    
    },
    data() {
      return {
        base_url: this.$config.reportApiUrl,
       base_url_management:this.$config.reportApiManagementUrl,
        reportGenerationPools:[],
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
          title: "Pool Name",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      reportGenerationPoolModel: undefined,
       deleteModel: undefined,
    };
    },
    beforeMount: function() {
        this.getReportGenerationPools()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
       result: {
            get: function() {
                return this.reportGenerationPools.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.reportGenerationPoolModel.id === undefined ? "Add" : "Edit"} Report Pool`;
        }
    },
    methods: {
       pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getReportGenerationPools(){
        console.log("getReportGenerationPools");
        try{
        const response = await axios.get(this.base_url_management + "getPools");
        if(response.data.status){
        this.reportGenerationPools = response.data.result;
        }
        else{
          this.reportGenerationPools =[];
        }
        this.gridDataTotal =this.reportGenerationPools.length;
        }catch(err){
            this.messageModel = err.response.data;
        }
    },
    async registerReportGenerationPool(dataItem){
        console.log("registerReportGenerationPool");
        try{
        let data = {
            name : dataItem.name
        }
        await axios.post(this.base_url_management + "addPool/"+data.name).then((response) => {
        //e.success(response.data.status);
        this.getReportGenerationPools();
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
    async updateReportGenerationPool(dataItem){
        console.log("updateReportGenerationPool");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name
        }
        await axios.post(this.base_url_management + "updatePool",data).then((response) => {
        //e.success(response.data.status);
       this.getReportGenerationPools();
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
     async deleteReportGenerationPool(dataItem){
        console.log("deleteReportGenerationPool");
        try{
        await axios.get(this.base_url_management + "deletePool/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       this.getReportGenerationPools();
        console.log(response);
      })
        }catch(err){
         this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.reportGenerationPoolModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.reportGenerationPoolModel;
      const isNewFilePool = dataItem.id == undefined;
      if (!isNewFilePool) {
        this.updateReportGenerationPool(dataItem);
      } else {
        this.registerReportGenerationPool(dataItem);
      }
      this.reportGenerationPoolModel = undefined;
    },
    cancelPopup() {
      this.reportGenerationPoolModel = undefined;
    },
    insert() {
      this.reportGenerationPoolModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
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
