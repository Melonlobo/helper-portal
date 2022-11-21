<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Email Pools</h2>
            <button title="Add new" class="k-button k-secondary btn-heading" @click="insert"><i class="fa fa-plus"></i>Add new</button>
            </div>
            <div>
                <Grid ref="grid" :data-items="result"
                :style="{ height: '67vh', width: '100%' }" 
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
                <dialog-container v-if="emailPoolModel" :dialog-title="dialogTitle" :data-item="emailPoolModel" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteEmailPool" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditEmailPool.vue";
import CommandCell from "../shared/CommandCell.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "EmailPools",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup   
    },
    data() {
      return {
      base_url: this.$config.emailApiUrl,
       base_url_management:this.$config.emailApiManagementUrl,
        emailPools:[],
         skip:0,
        take:10,
        pageSize:10,
         messageModel: undefined,
        gridDataTotal:0,
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
      emailPoolModel: undefined,
      deleteModel: undefined
    };
    },
    beforeMount: function() {
        this.getEmailPools()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
        result: {
            get: function() {
                return this.emailPools.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.emailPoolModel.id === undefined ? "Add" : "Edit"} Email Pool`;
        }
    },
    methods: {
      pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getEmailPools(){
        console.log("getEmailPools");
        try{
        const response = await axios.get(this.base_url_management + "getEmailPools");
        if(response.data.status){
        this.emailPools = response.data.result;
        }
        else{
          this.emailPools = [];
        }
        this.gridDataTotal =this.emailPools.length;
        }catch(err){
            console.log(err)
        }
    },
    async registerEmailPool(dataItem){
        console.log("registerEmailPool");
        try{
        let data = {
            name : dataItem.name
        }
        await axios.post(this.base_url_management + "addEmailPool",data).then((response) => {
        //e.success(response.data.status);
        this.getEmailPools();
        console.log(response);
      })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateEmailPool(dataItem){
        console.log("updateEmailPool");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name
        }
        await axios.post(this.base_url_management + "updateEmailPool",data).then((response) => {
        //e.success(response.data.status);
       this.getEmailPools();
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
     async deleteEmailPool(dataItem){
        console.log("deleteEmailPool");
        try{
        await axios.get(this.base_url_management + "deleteEmailPool/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       this.getEmailPools();
        console.log(response);
        
      })
        }catch(err){
       this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.emailPoolModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.emailPoolModel;
      const isNewEmailPool = dataItem.id == undefined;
      if (!isNewEmailPool) {
        this.updateEmailPool(dataItem);
      } else {
        this.registerEmailPool(dataItem);
      }
      this.emailPoolModel = undefined;
    },
    cancelPopup() {
      this.emailPoolModel = undefined;
    },
    confirmDeletePopup(dataItem){
      this.deleteModel = this.cloneProduct(dataItem);
    },
    cancelConfirmation(){
      this.deleteModel = undefined;
    },
    insert() {
      this.emailPoolModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    messagePopupOk(){
        this.messageModel = undefined;
    }
    }
})
</script>
