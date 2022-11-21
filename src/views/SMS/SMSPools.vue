<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">SMS Pools</h2>
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
                <dialog-container v-if="smsPoolModel" :dialog-title="dialogTitle" :data-item="smsPoolModel" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteSMSPool" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditSMSPool.vue";
import CommandCell from "../shared/CommandCell.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "SMSPools",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup          
    },
    data() {
      return {
        base_url: this.$config.smsApiUrl,
       base_url_management:this.$config.smsApiManagementUrl,
        smsPools:[],
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
          title: "Pool Name",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      smsPoolModel: undefined, 
      deleteModel: undefined,
      messageModel: undefined
    };
    },
    beforeMount: function() {
        this.getSMSPools()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
        result: {
            get: function() {
                return this.smsPools.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.smsPoolModel.id === undefined ? "Add" : "Edit"} SMS Pool`;
        }
    },
    methods: {
      pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getSMSPools(){
        console.log("getSMSPools");
        try{
        const response = await axios.get(this.base_url_management + "getSMSPools");
        if(response.data.status){
        this.smsPools = response.data.result;
        }
        else{
          this.smsPools=[];
        }
        this.gridDataTotal =this.smsPools.length;
        }catch(err){
           this.messageModel = err.response.data;
        }
    },
    async registerSMSPool(dataItem){
        console.log("registerSMSPool");
        try{
        let data = {
            name : dataItem.name
        }
        await axios.post(this.base_url_management + "addSMSPool",data).then((response) => {
        //e.success(response.data.status);
        this.getSMSPools();
        console.log(response);
      })
        }catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateSMSPool(dataItem){
        console.log("updateSMSPool");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name
        }
        await axios.post(this.base_url_management + "updateSMSPool",data).then((response) => {
        //e.success(response.data.status);
       this.getSMSPools();
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
     async deleteSMSPool(dataItem){
        console.log("deleteSMSPool");
        try{
        await axios.get(this.base_url_management + "deleteSMSPool/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       this.getSMSPools();
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.smsPoolModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.smsPoolModel;
      const isNewSMSPool = dataItem.id == undefined;
      if (!isNewSMSPool) {
        this.updateSMSPool(dataItem);
      } else {
        this.registerSMSPool(dataItem);
      }
      this.smsPoolModel = undefined;
    },
    cancelPopup() {
      this.smsPoolModel = undefined;
    },
    insert() {
      this.smsPoolModel = {};
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
