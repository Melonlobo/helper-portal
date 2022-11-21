<template>
  <k-dialog @close="cancel" :max-width="400" :title="action">
     <div class="row c-danger ml-0">
          <p v-if="errors.length > 0" class="text-left">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="(error,index) in errors" :key="index">{{ error }}</li>
            </ul>
          </p>
      </div>
    <form class="k-form" @submit.prevent="save">
        <input type="hidden" v-model="roleMapModel.id">
      <div style="width: 50vw" v-if="!isEdit">
        <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Role<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'channelKey'"
              v-model="roleMapModel.role"
              class="form-control"
              required
            ></k-input>
          </div>
        </div>
      </div>
      <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Channel Key<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
           <select class="form-control"  
             v-model="roleMapModel.channelID"
             @change="getPermissions"
             required
            >
            <option v-for="channel in channels" :key="channel.id" :value="channel.id">
              {{channel.channelKey}}
            </option>
            </select>
          </div>
      </div>
      <div class="form-group row" :style="{ marginBottom: '1rem' }" v-if="!roleMapModel.channelID || permissions.length>0">
          <label class="col-sm-3 text-left col-form-label">
            Permission Name<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
           <select class="form-control"  
             v-model="roleMapModel.permissionID"
            @change="getAccessLevels"
             required
            >
            <option v-for="permission in permissions" :key="permission.id" :value="permission.id">
              {{permission.permissionName}}
            </option>
            </select>
          </div>
      </div>
      <p class="text-danger" v-else>Channel does not have any permissions</p>
      <div class="form-group row" :style="{ marginBottom: '1rem' }" v-if="accessLevels && accessLevels.length ">
          <label class="col-sm-3 text-left col-form-label">
            Access Level<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
           <select class="form-control"  
             v-model="roleMapModel.accessLevelID"
             required
            >
            <option v-for="accessLevel in accessLevels" :key="accessLevel.id" :value="accessLevel.id">
              {{accessLevel.accessLevel}}
            </option>
            </select>
          </div>
      </div>
      <div class="d-flex ">
      <button class="k-button col-6" @click="cancel" >Cancel</button>
      <button type="submit" class="k-button k-primary col-6 mb-0" tabindex="0">Save</button>

    </div>    </form>
      
  
  </k-dialog>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Input } from "@progress/kendo-vue-inputs";
import "@progress/kendo-ui/js/kendo.core";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import axios from "axios";

export default {
  components: {
    "k-input": Input,
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
    dropdownlist: DropDownList,
  },
  props: {
    dataItem: Object,
    dialogTitle: String,
    channels:Array,
  },
  data: function () {
    return {
      errors: [],
      base_url_management:this.$config.rolePermissionApiManagementUrl,
      roleMapModel: {
        id: "",
        channelKey: undefined,
        channelID:"",
        description: "",
        applicationID: "",
        permissionID:"",
        accessLevelID:""
      },
      permissions:[],
      accessLevels:[],
      isEdit: false,
      action: "",
    };
  },
  validations: {
    roleMapModel: {},
  },
  created: function () {
    if (this.$props.dataItem) {
      this.roleMapModel = this.$props.dataItem;
    }
    this.action = this.$props.dialogTitle;
    if (this.roleMapModel.id != undefined) this.isEdit = true;
  },
  methods: {
    
     async getPermissions(){
      try{        
        const response = await axios.get(this.base_url_management + "GetPermissions/"+this.roleMapModel.channelID);
        this.permissions = response.data.result;
        }catch(err){
            this.messageModel = err.response.data;
        }
        this.accessLevels = [];
        this.roleMapModel.accessLevelID = "";
        this.roleMapModel.permissionID = "";
  },
      getAccessLevels(e){
        this.accessLevels = this.permissions.find(permission => 
          permission.id === this.roleMapModel.permissionID).accessLevels;
      console.log(this.accessLevels );
        this.roleMapModel.accessLevelID = "";
    },
    cancel() {
      this.$emit("cancel");
    },
    save() {
      // console.log("SAVED");
      // this.$emit("save");
       this.errors = [];
       debugger
      if($.trim(this.roleMapModel.role) == "" ){
        this.roleMapModel.role = undefined;
        this.errors.push("Please enter a Role.");
      }
      if($.trim(this.roleMapModel.permissionID) == "" || !this.roleMapModel.permissionID){
        this.roleMapModel.permissionID = undefined;
        this.errors.push("Please Select a Permission.");
      }
      if($.trim(this.roleMapModel.channelID) == "" || !this.roleMapModel.channelID){
        this.roleMapModel.channelID = undefined;
        this.errors.push("Please Select a Permission.");
      }
      if(this.roleMapModel.role && this.roleMapModel.permissionID && this.roleMapModel.channelID){
        this.errors = [];
        this.$emit("save");
      }
    },
  },
};
</script>
<style scoped>
.imageButton {
  display: block;
  position: relative;
  width: 100%;
  margin: auto;
  cursor: pointer;
  border: 0;
  height: 30px;
  color: transparent;
  border-radius: 5px;
  outline: 0;
}
.imageButton:hover:after {
  background: #da3b30;
}
.imageButton:after {
  transition: 200ms all ease;
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  background: #303f9f;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 15px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  content: "Upload Image";
  line-height: 30px;
  border-radius: 5px;
}

p{
  margin-bottom: 0px;
}
</style>