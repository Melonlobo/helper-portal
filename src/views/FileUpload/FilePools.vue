<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">File Pools</h2>
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
                <dialog-container v-if="filePoolModel" :dialog-title="dialogTitle" :data-item="filePoolModel" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteFilePool" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditFilePool.vue";
import CommandCell from "../shared/CommandCell.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "FilePools",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup    
    },
    data() {
      return {
        base_url: this.$config.fileApiUrl,
       base_url_management:this.$config.fileApiManagementUrl,
        filePools:[],
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
      filePoolModel: undefined,
       deleteModel: undefined,
    };
    },
    beforeMount: function() {
        this.getFilePools()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
       result: {
            get: function() {
                return this.filePools.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.filePoolModel.id === undefined ? "Add" : "Edit"} File Pool`;
        }
    },
    methods: {
       pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getFilePools(){
        console.log("getFilePools");
        try{
        const response = await axios.get(this.base_url_management + "getFilePools");
        if(response.data.status){
        this.filePools = response.data.result;
        }
        else{
          this.filePools =[];
        }
        this.gridDataTotal =this.filePools.length;
        }catch(err){
            this.messageModel = err.response.data;
        }
    },
    async registerFilePool(dataItem){
        console.log("registerFilePool");
        try{
        let data = {
            name : dataItem.name
        }
        await axios.post(this.base_url_management + "addFilePool",data).then((response) => {
        //e.success(response.data.status);
        this.getFilePools();
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
    async updateFilePool(dataItem){
        console.log("updateFilePool");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name
        }
        await axios.post(this.base_url_management + "updateFilePool",data).then((response) => {
        //e.success(response.data.status);
       this.getFilePools();
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
     async deleteFilePool(dataItem){
        console.log("deleteFilePool");
        try{
        await axios.get(this.base_url_management + "deleteFilePool/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       this.getFilePools();
        console.log(response);
      })
        }catch(err){
         this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.filePoolModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.filePoolModel;
      const isNewFilePool = dataItem.id == undefined;
      if (!isNewFilePool) {
        this.updateFilePool(dataItem);
      } else {
        this.registerFilePool(dataItem);
      }
      this.filePoolModel = undefined;
    },
    cancelPopup() {
      this.filePoolModel = undefined;
    },
    insert() {
      this.filePoolModel = {};
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
