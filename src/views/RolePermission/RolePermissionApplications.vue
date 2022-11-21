<template>
    <div class="application">
        <div class="container-fluid">
            <div class="panel-heading">
                <h2 class="text-left">Role Permission Applications</h2>
                    <button class="k-button k-secondary btn-heading" @click="insert"><i class="fa fa-plus"></i>Add new</button>
                </div>
                
                <Grid ref="grid" :data-items="result"
                :style="{ height: '65vh', width: '100%', bottom: '10px' }"
                 :columns="columns"
                 :pageable="true"
                 :page-size="pageSize"
                 :skip="skip"
                 :take="take"
                  :resizable="true"
                 :total="gridDataTotal"
                 @pagechange="pageChangeHandler"
                >
                   <template v-slot:customCommandTemplate="{props}">
                        <custom-command-cell :data-item="props.dataItem" 
                        @edit="edit"
                        @remove="confirmDeletePopup"/>
                    </template>
                </Grid>
                <dialog-container v-if="applicationModel" :dialog-title="dialogTitle" :data-item="applicationModel" @save="save" @cancel="cancel">
                </dialog-container>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteApplication" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditRolePermissionApplication.vue";
import CommandCell from "../shared/CommandCell.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "applications",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup
    },
    data() {
      return {
    base_url: this.$config.rolePermissionApiUrl,
       base_url_management:this.$config.rolePermissionApiManagementUrl,
        applications:[],
        skip:0,
        take:10,
        pageSize:10,
        deleteModel: undefined,
        messageModel:undefined,
        gridDataTotal:0,
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "key",
          editable: false,
          title: "Application Key",
          //type: "text",
          // width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      applicationModel: undefined
    };
    },
    beforeMount: function() {
        this.getApplications()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
        console.log(this.skip)
        console.log(this.take)
    },
     computed: {
       result: {
            get: function() {
                return this.applications.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.applicationModel.id === undefined ? "Add" : "Edit"} Role Permission Application`;
        }
    },
    methods: {
    pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getApplications(){
        console.log("getApplications");
        try{
        const response = await axios.get(this.base_url_management + "getapplications");
        if(response.data.status){
        this.applications = response.data.result;        
        }
        else{
          this.applications = [];
        }
        this.gridDataTotal =this.applications.length;
        }catch(err){
             this.messageModel = err.response.data;
        }
    },
    async registerApplication(dataItem){
        console.log("registerApplication");
        try{
          await axios.post(this.base_url + "registerapplication/"+dataItem.key).then((response) => {
            this.getApplications();
            console.log(response);
          })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateApplication(dataItem){
        console.log("updateApplication");
        try{
          var dataToBePosted = {
              id : dataItem.id,
              key : dataItem.key
          };
        await axios.post(this.base_url_management + "updateapplication", dataToBePosted).then((response) => {
        //e.success(response.data.status);
       this.getApplications();
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
     async deleteApplication(dataItem){
        console.log("deleteApplication");
        try{
        await axios.get(this.base_url_management + "deleteapplication/"+dataItem.id).then((response) => {
       this.getApplications();
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.applicationModel = this.cloneProduct(dataItem);
    },
    save() {
      const dataItem = this.applicationModel;
      const isNewApplication = dataItem.id == undefined;
      if (!isNewApplication) {
        this.updateApplication(dataItem);
      } else {
        this.registerApplication(dataItem);
      }
      this.applicationModel = undefined;
    },
    cancel() {
      this.applicationModel = undefined;
    },
    insert() {
      this.applicationModel = {};
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
<style scoped>
</style>