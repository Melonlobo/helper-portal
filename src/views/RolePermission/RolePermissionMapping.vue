<template>
    <div class="channel">
        <div class="container-fluid">
            <div class="panel-heading">
                <h2 class="text-left">Role Permission Mapping</h2>
                    <button class="k-button k-secondary btn-heading" @click="insert"><i class="fa fa-plus"></i>Add new</button>
                </div>
                <div>
                  
                <form class="panel-heading p-0" @submit.prevent="validateForm">
              <div class="table-responsive">
              <table class="table mb-0 sm-font text-left">
              <tr>
                  <td class="custom-table-cell">
                      <label>Channel Keys<span class="c-danger">*</span></label>
                  </td>
                  <td> 
                        <dropdownlist
                        :style="{'font-size': '12px'}"
                          :data-items="permissionChannels"   
                          :default-item="ddlDefault"   
                          :text-field="'channelKey'"
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
                        :hide-update = true 
                        @edit="edit"
                        @remove="confirmDeletePopup"/>
                    </template>
                </Grid>
                
                <dialog-container v-if="rolePermissionModel" :dialog-title="dialogTitle" :data-item="rolePermissionModel" :channels ="permissionChannels"  @save="save" @cancel="cancel">
                </dialog-container>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteRolePermissionMap" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
                </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditRolePermissionMapping.vue";
import CommandCell from "../shared/CommandCell.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";

export default ({
    name: "rolePermissionMaps",
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
        rolePermissionMaps:[],
        skip:0,
        take:10,
        pageSize:10,
        deleteModel: undefined,
        permissionChannels:[],
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
          field: "role",
          editable: false,
          title: "Role Name",
          //type: "text",
          // width: "150px" 
        },{
          field: "channelKey",
          editable: false,
          title: "Channel Key",
          //type: "text",
          // width: "150px" 
        },{
          field: "permissionName",
          editable: false,
          title: "Permission Name",
          //type: "text",
          // width: "150px" 
        },{
          field: "accessLevel",
          editable: false,
          title: "Access Level",
          //type: "text",
          // width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      rolePermissionModel: undefined,
      ddlDefault: {
        id: "",
        channelKey: "Select",
      },
    };
    },
    beforeMount: function() {
        this.getChannels()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
        console.log(this.skip)
        console.log(this.take)
    },
     computed: {
       result: {
            get: function() {
                return this.rolePermissionMaps.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.rolePermissionModel.id === undefined ? "Add" : "Edit"} Role Permission Mapping`;
        }
    },
    methods: {
    onChangeApplication(event){
         this.selectedChannel = event.target.value;        
    },
    pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    validateForm(e){
        if(this.selectedChannel != undefined && this.selectedChannel.channelKey == "Select"){
            this.selectedChannel = undefined
        }
        if(this.selectedChannel){
            this.getRolePermissionMappping();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.selectedChannel) {
        this.errors.push('Please select a Pool Name.');
      }

      e.preventDefault();
    },
     async getChannels(){
      try{
        const response = await axios.get(this.base_url_management + "GetChannelKeys");
        this.permissionChannels = response.data.result;
        }catch(err){
            this.messageModel = err.response.data;
        }
    },
    async getRolePermissionMappping(){
        console.log("getPermissionMap");
        try{
        const response = await axios.get(this.base_url_management + "getRolePermissionMap/" + this.selectedChannel.id);
        if(response.data.status){
        this.rolePermissionMaps = response.data.result;        
        }
        else{
          this.rolePermissionMaps = [];
        }
        this.gridDataTotal =this.rolePermissionMaps.length;
        }catch(err){
             this.messageModel = err.response.data;
        }
    },
    async addRolePermissionMap(dataItem){
        console.log("addRolePermissionMap");
        try{
          var dataToBePosted = {
              channelID : dataItem.channelID,
              permissionID:dataItem.permissionID,
              accessLevelID:dataItem.accessLevelID,
              role:dataItem.role
          };
          await axios.post(this.base_url_management + "AssignPermissionForRole",dataToBePosted).then((response) => {
            this.getRolePermissionMappping();
            console.log(response);
          })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
     async deleteRolePermissionMap(dataItem){
       
          var dataToBePosted = {
              channelID : dataItem.channelID,
              permissionID:dataItem.permissionID,
              accessLevelID:dataItem.accessLevelID,
              role:dataItem.role
          };
        console.log("deleteRolePermissionMap");
        try{
        await axios.post(this.base_url_management + "RemovePermissionForRole",dataToBePosted).then((response) => {
       this.getRolePermissionMappping();
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.rolePermissionModel = this.cloneProduct(dataItem);
    },
    save() {
      const dataItem = this.rolePermissionModel;
      const isNewChannel = dataItem.id == undefined;
      this.addRolePermissionMap(dataItem);
      this.rolePermissionModel = undefined;
    },
    cancel() {
      this.rolePermissionModel = undefined;
    },
    insert() {
      this.rolePermissionModel = {};
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