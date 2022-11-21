<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Permissions</h2>
            </div>
            <div>
                <!-- <div class="row">
                    <button title="Add new" class="m-2 k-button k-primary" @click="insert"><i class="fa fa-plus mr-2"></i>Add new</button>
                </div> -->
                <form class="panel-heading p-0" @submit.prevent="validateForm">
                <div class="table-responsive">
                  <table class="table mb-0 sm-font text-left">
                              <tr>
                      <td class="custom-table-cell">
                          <label>Channel Key<span class="c-danger">*</span></label>
                      </td>
                      <td> 
                            <dropdownlist
                            :style="{'font-size': '12px'}"
                              :data-items="permissionChannelKeys"      
                              :default-item="ddlDefault"   
                          :text-field="'channelKey'"
                              :data-item-id="'id'" 
                              v-model="permissionsChannelKey"
                              @change="onChangeChannelKey">
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
                      <td class="btn-add-email-provider">
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
                <dialog-container v-if="permissionModel" :dialog-title="dialogTitle" :data-item="permissionModel" :permissionChannelKeys="permissionChannelKeys" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deletePermission" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditPermission.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "permissions",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
         dropdownlist: DropDownList,    
         "error-popup":ErrorPopup,
         "confirmation-popup": ConfirmationPopup ,
         "message-popup":MessagePopup
    },
    data() {
      return {
    base_url: this.$config.rolePermissionApiUrl,
       base_url_management:this.$config.rolePermissionApiManagementUrl,
        permissions:[],
        permissionChannelKeys: undefined,
        permissionsChannelKey: undefined,
        errors: [],
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
          field: "permissionName",
          editable: false,
          title: "Permission Name",
          //type: "text",
          //width: "150px" 
        },{
          field: "description",
          editable: false,
          title: "Description",
          //type: "text",
          //width: "150px" 
        },{
          field: "moduleName",
          editable: false,
          title: "Module Name",
          //type: "text",
          //width: "150px" 
        },{
          field: "accessLevels",
          editable: false,
          title: "Access Levels",
          cell: this.modifyAccessLevelsColumn
          //type: "text",
          //width: "150px" 
        },{
          field: "channelKey",
          editable: false,
          title: "Channel Key",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
       ddlDefault: {
        id: "",
        channelKey: "Select",
      },
      permissionModel: undefined,
      deleteModel: undefined
    };
    },
    beforeMount: function() {
        this.getPermissionChannelKeys()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
       result: {
            get: function() {
                return this.permissions.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.permissionModel.id === undefined ? "Add" : "Edit"} Permission`;
        }
    },
    methods: {
        pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getPermissionChannelKeys(){
try{
        const response = await axios.get(this.base_url_management + "GetChannelKeys");
        this.permissionChannelKeys = response.data.result;
        }catch(err){
            this.messageModel = err.response.data;
        }
    }, 
    onChangeChannelKey(event){
         this.permissionsChannelKey = event.target.value;        
    },
    async getPermissions(){
        console.log("getPermissions");
        try{
        const response = await axios.get(this.base_url_management + "GetPermissions/"+ this.permissionsChannelKey.id);
        if(response.data.status){
        this.permissions = response.data.result;
        }else{
          this.permissions = [];
        }
        this.gridDataTotal =this.permissions.length;
        }catch(err){
           this.messageModel = err.response.data;
        }
    },
    async addPermission(dataItem){
        console.log("addPermission");
        try{
        let data = {
          channelKey: dataItem.channelKey,
            permissionName : dataItem.permissionName,
            description: dataItem.description,
            moduleName: dataItem.moduleName,
            accessLevels: dataItem.accessLevels
        }
        await axios.post(this.base_url_management + "createPermission",data).then((response) => {
        //e.success(response.data.status);
        if(this.permissionsChannelKey != undefined){
       this.getPermissions();
        }
      })
        }
        catch(err){
             this.messageModel = err.response.data;
        }
    },
    async updatePermission(dataItem){
        console.log("updatePermission");
        try{
            let data = {
              id: dataItem.id,
              channelKey: dataItem.channelKey,
               permissionName : dataItem.permissionName,
            description: dataItem.description,
            moduleName: dataItem.moduleName,
            accessLevels: dataItem.accessLevels
        }
        await axios.post(this.base_url_management + "updatePermission",data).then((response) => {
        //e.success(response.data.status);
        if(this.permissionsChannelKey != undefined){
       this.getPermissions();
        }
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
     async deletePermission(dataItem){
        console.log("deletePermission");
        try{
        await axios.get(this.base_url_management + "deletePermission/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
        if(!response.data.status){
          this.messageModel = response.data.message;
        }
       if(this.permissionsChannelKey != undefined){
       this.getPermissions();
        }
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.permissionModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.permissionModel;
      const isNewPermission = dataItem.id == undefined;
      if (!isNewPermission) {
        this.updatePermission(dataItem);
      } else {
        this.addPermission(dataItem);
      }
      this.permissionModel = undefined;
    },
    cancelPopup() {
      this.permissionModel = undefined;
    },
    insert() {
      this.permissionModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    validateForm(e){
        if(this.permissionsChannelKey != undefined && this.permissionsChannelKey.name == "Select"){
            this.permissionsChannelKey = undefined
        }
        if(this.permissionsChannelKey){
            this.getPermissions();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.permissionsChannelKey) {
        this.errors.push('Please select a Channel Key.');
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
    },
    modifyAccessLevelsColumn: function (h, tdElement , props, listeners ) {
      let accessLevelString = "";
            props.dataItem.accessLevels.forEach(element => {
              accessLevelString += element.accessLevel + ", "
            });
            return h('td', [accessLevelString]);
        }
    }
})
</script>
<style scoped>
.btn-add-email-provider{
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
