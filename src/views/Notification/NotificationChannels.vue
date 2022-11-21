<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Notification Channels</h2>
            </div>
            <div>
              <form class="panel-heading p-0" @submit.prevent="validateForm">
                <div class="table-responsive">
                  <table class="table mb-0 text-left sm-font">
                    <tr>
                      <td class="custom-table-cell">
                          <label>Application Key<span class="c-danger">*</span></label>
                      </td>
                      <td> 
                            <dropdownlist
                             :style="{'font-size': '12px'}"
                              :data-items="notificationApplicationKeys"   
                              :default-item="ddlDefault"   
                          :text-field="'applicationKey'"
                              :data-item-id="'id'"         
                              v-model="notificationApplicationKey"
                              @change="onChangeApplicationKey">
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
                      <td class="btn-add-notification-channel">
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
                <dialog-container v-if="notificationChannelModel" :dialog-title="dialogTitle" :data-item="notificationChannelModel" :notificationApplicationKeys="this.notificationApplicationKeys" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteNotificationChannel" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditNotificationChannel.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "NotificationChannels",
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
       base_url: this.$config.notificationApiUrl,
       base_url_management:this.$config.notificationApiManagementUrl,
       gridDataTotal:0,
         skip:0,
        take:10,
        pageSize:10,
        messageModel: undefined,
        notificationChannels:[],
        notificationApplicationKeys: undefined,
        notificationApplicationKey: undefined,
        errors: [],
        selectedApplicationKey: undefined,
        ddlDefault: {
        id: "",
        applicationKey: "Select",
      },
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "channelKey",
          editable: false,
          title: "Channel Key",
          //type: "text",
          //width: "150px" 
        },{
          field: "description",
          editable: false,
          title: "Channel Description",
          //type: "text",
          //width: "150px" 
        },{
          field: "applicationKey",
          editable: false,
          title: "Application",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      notificationChannelModel: undefined,
      deleteModel: undefined,
    };
    },
    beforeMount: function() {
        this.getNotificationApplicationKeys();
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
        result: {
            get: function() {
                return this.notificationChannels.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.notificationChannelModel.id === undefined ? "Add" : "Edit"} Notification Channel`;
        }
    },
    methods: {
         pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
     async getNotificationApplicationKeys(){
        try{
        const response = await axios.get(this.base_url_management + "GetApplicationKeys");
        this.notificationApplicationKeys = response.data.result;
        console.log(this.notificationApplicationKeys);
        }catch(err){
            console.log(err)
        }
    },
    async getNotificationChannels(){
        console.log("getNotificationChannels");
        try{
        const response = await axios.get(this.base_url_management + "GetChannelsByApplicationID/"+this.selectedApplicationKey.id);
        if(response.data.status){
        this.notificationChannels = response.data.result;
        }else{
          this.notificationChannels = [];
        }
         this.gridDataTotal =this.notificationChannels.length;
        }catch(err){
           this.messageModel = err.response.data;
        }
    },
    async addNotificationChannel(dataItem){
        console.log("addNotificationChannel");
        try{
        let data = {
            channelKey : dataItem.channelKey,
            description: dataItem.description,
            applicationID: dataItem.applicationID
        }
        await axios.post(this.base_url_management + "addChannel",data).then((response) => {
        //e.success(response.data.status);
        if(this.selectedApplicationKey != undefined){
        this.getNotificationChannels();
        }
        console.log(response);
      })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateNotificationChannel(dataItem){
        console.log("updateNotificationChannel");
        try{
            let data = {
                id: dataItem.id,
                channelKey : dataItem.channelKey,
                description: dataItem.description,
                applicationID: dataItem.applicationID
            }
        await axios.post(this.base_url_management + "updateChannel",data).then((response) => {
        //e.success(response.data.status);
       if(this.selectedApplicationKey != undefined){
        this.getNotificationChannels();
        }
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
     async deleteNotificationChannel(dataItem){
        console.log("deleteNotificationChannel");
        try{
        await axios.get(this.base_url_management + "deleteChannel/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       if(this.selectedApplicationKey != undefined){
        this.getNotificationChannels();
        }
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.notificationChannelModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.notificationChannelModel;
      const isNewChannel = dataItem.id == undefined;
      if (!isNewChannel) {
        this.updateNotificationChannel(dataItem);
      } else {
        this.addNotificationChannel(dataItem);
      }
      this.notificationChannelModel = undefined;
    },
    cancelPopup() {
      this.notificationChannelModel = undefined;
    },
    insert() {
      this.notificationChannelModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    onChangeApplicationKey(event){
         this.selectedApplicationKey = event.target.value;        
    },
    validateForm(e){
        if(this.selectedApplicationKey != undefined && this.selectedApplicationKey.name == "Select"){
            this.selectedApplicationKey = undefined
        }
        if(this.selectedApplicationKey){
            this.getNotificationChannels();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.selectedApplicationKey) {
        this.errors.push('Please select an Application Key.');
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
.btn-add-notification-channel{
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


