<template>
    <div class="channel">
        <div class="container-fluid">
            <div class="panel-heading">
                <h2 class="text-left">Role Permission Channels</h2>
                    <button class="k-button k-secondary btn-heading" @click="insert"><i class="fa fa-plus"></i>Add new</button>
                </div>
                <div>
                  
                <form class="panel-heading p-0" @submit.prevent="validateForm">
              <div class="table-responsive">
              <table class="table mb-0 sm-font text-left">
              <tr>
                  <td class="custom-table-cell">
                      <label>Application<span class="c-danger">*</span></label>
                  </td>
                  <td> 
                        <dropdownlist
                        :style="{'font-size': '12px'}"
                          :data-items="permissionApplications"   
                          :default-item="ddlDefault"   
                          :text-field="'key'"
                          :data-item-id="'id'"         
                          @change="onChangeApplication">
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
                  <td class="btn-add-email-channel">
                      <button type="button" class="k-button k-secondary" @click="insert"><i class="fa fa-plus"></i>Add new</button>

                  </td>
                </tr>
              </table>
              </div>
              </form>
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
                
                <dialog-container v-if="channelModel" :dialog-title="dialogTitle" :data-item="channelModel" :applications ="permissionApplications"  @save="save" @cancel="cancel">
                </dialog-container>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteChannel" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
                </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditRolePermissionChannel.vue";
import CommandCell from "../shared/CommandCell.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";

export default ({
    name: "channels",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
          dropdownlist: DropDownList, 
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup
    },
    data() {
      return {
    base_url: this.$config.rolePermissionApiUrl,
       base_url_management:this.$config.rolePermissionApiManagementUrl,
        channels:[],
        skip:0,
        take:10,
        pageSize:10,
        deleteModel: undefined,
        permissionApplications:[],
        permissionApplication:undefined,
        messageModel:undefined,
        gridDataTotal:0,
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
          // width: "150px" 
        },{
          field: "description",
          editable: false,
          title: "Description",
          //type: "text",
          // width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      channelModel: undefined,
      ddlDefault: {
        id: "",
        key: "Select",
      },
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
                return this.channels.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.channelModel.id === undefined ? "Add" : "Edit"} Role Permission Channel`;
        }
    },
    methods: {
    onChangeApplication(event){
         this.selectedApplication = event.target.value;        
    },
    pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    validateForm(e){
        if(this.selectedApplication != undefined && this.selectedApplication.key == "Select"){
            this.selectedApplication = undefined
        }
        if(this.selectedApplication){
            this.getChannels();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.selectedApplication) {
        this.errors.push('Please select a Pool Name.');
      }

      e.preventDefault();
    },
     async getApplications(){
      try{
        const response = await axios.get(this.base_url_management + "GetApplications");
        this.permissionApplications = response.data.result;
        }catch(err){
            this.messageModel = err.response.data;
        }
    },
    async getChannels(){
        console.log("getChannels");
        try{
        const response = await axios.get(this.base_url_management + "getChannelsByApplicationID/" + this.selectedApplication.id);
        if(response.data.status){
        this.channels = response.data.result;        
        }
        else{
          this.channels = [];
        }
        this.gridDataTotal =this.channels.length;
        }catch(err){
             this.messageModel = err.response.data;
        }
    },
    async registerChannel(dataItem){
        console.log("registerChannel");
        try{
           var dataToBePosted = {
              channelKey : dataItem.channelKey,
              applicationID: dataItem.applicationID,
              description:dataItem.description
          };
          await axios.post(this.base_url_management + "addChannel",dataToBePosted).then((response) => {
            this.getChannels();
            console.log(response);
          })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateChannel(dataItem){
        console.log("updateChannel");
        try{
          var dataToBePosted = {
              id : dataItem.id,
              channelKey : dataItem.channelKey,
              description:dataItem.description
          };
        await axios.post(this.base_url_management + "updatechannel", dataToBePosted).then((response) => {
        //e.success(response.data.status);
       this.getChannels();
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
     async deleteChannel(dataItem){
        console.log("deleteChannel");
        try{
        await axios.get(this.base_url_management + "deletechannel/"+dataItem.id).then((response) => {
       this.getChannels();
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.channelModel = this.cloneProduct(dataItem);
    },
    save() {
      const dataItem = this.channelModel;
      const isNewChannel = dataItem.id == undefined;
      if (!isNewChannel) {
        this.updateChannel(dataItem);
      } else {
        this.registerChannel(dataItem);
      }
      this.channelModel = undefined;
    },
    cancel() {
      this.channelModel = undefined;
    },
    insert() {
      this.channelModel = {};
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