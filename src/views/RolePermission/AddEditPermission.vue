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
        <input type="hidden" v-model="permissionModel.id">
        <input type="hidden" v-model="permissionModel.channelID">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Channel Key<span class="c-danger">*</span>:
          </label>
           <div class="col-sm-9">
             <dropdownlist 
             ref="dropdownlist"
             :disabled="isEdit"
                          :data-source="permissionChannelKeyList"   
                          :option-label="'Select'" 
                          :name="'channelKey'"  
                          :data-text-field="'channelKey'"
                          :data-value-field="'id'" 
                          @change="onChangeChannelKey">
                        </dropdownlist>
          </div>
        </div>
        <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Pernission Name<span class="c-danger">*</span>:
          </label>   
          <div class="col-sm-9">
          <k-input :disabled="isEdit"
              type="text"
              :name="'permissionName'"
              v-model="permissionModel.permissionName"
              class="form-control"
              required
            ></k-input> 
          </div>   
        </div>  
        <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Description:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'description'"
              v-model="permissionModel.description"
              class="form-control"
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Module Name:
          </label>   
          <div class="col-sm-9">
          <k-input
              type="text"
              :name="'moduleName'"
              v-model="permissionModel.moduleName"
              class="form-control"
            ></k-input>    
          </div>
        </div>    
        <div class="form-group row" :style="{ marginBottom: '1rem' }" v-if="this.isEdit && this.permissionModel.accessLevels.length > 0 || !this.isEdit">
          <label class="col-sm-3 text-left col-form-label">Access Level</label>  
            <div class="d-md-inline d-flex" v-if="!this.isEdit">   
              <button id="addRowBtn" class="k-button k-primary btn-add-row" type="button" tabindex="0" @click="addRow(null)">Add Row</button>
              <button id="removeRowBtn" class="k-button k-primary btn-remove-row" disabled type="button" tabindex="0" @click="removeRow">Remove Last Row</button>                   
            </div>
            <div class="maxHeightTable">
              <table id="accessLevelTable">
                <tr>
                  <td><input placeholder="Access Level Name" id="dataPartName" class="k-textbox"/></td>
                  <td><input placeholder="Access Level Description" id="dataPartDescription" class="k-textbox"/></td>
                </tr>
              </table>
            </div>
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
import { required } from "vuelidate/lib/validators";
import { DropDownList } from "@progress/kendo-dropdowns-vue-wrapper";
import "@progress/kendo-ui/js/kendo.core";
import "@progress/kendo-ui/js/kendo.data";
import "@progress/kendo-ui/js/kendo.dropdownlist";

import axios from "axios";

export default {
  components: {
    "k-input": Input,
    "k-dialog": Dialog,
    dropdownlist: DropDownList,
    "dialog-actions-bar": DialogActionsBar
  },
  props: {
    dataItem: Object,
    dialogTitle: String,
    permissionChannelKeys: Array
  },
  mounted: async function(){
     if(this.permissionModel.accessLevels && this.permissionModel.accessLevels.length > 0){
          $("#dataPartName").val(this.permissionModel.accessLevels[0].accessLevel);
          $("#dataPartName").prop("disabled", true);
        $("#dataPartDescription").val(this.permissionModel.accessLevels[0].accessDescription);
      }
      if(this.permissionModel.accessLevels && this.permissionModel.accessLevels.length > 1){
          for (var i=1;i<this.permissionModel.accessLevels.length;i++){
            this.addRow(this.permissionModel.accessLevels[i].accessLevel, this.permissionModel.accessLevels[i].accessDescription)
        }
      }
      if(this.isEdit){
          var dropdown = this.$refs.dropdownlist.kendoWidget();
            dropdown.value(this.permissionModel.channelID);
      }
  },
  data: function () {
    return {
        base_url: this.$config.rolePermissionApiUrl,
       base_url_management:this.$config.rolePermissionApiManagementUrl,
      permissionModel: {
        id: "",
        channelKey: undefined,
        permissionName: undefined,
        description: undefined,
        moduleName: undefined,
        accessLevel: []
      },
      errors: [],
      permissionChannelKeyList: undefined,
      isEdit: false,
      action: ""
    };
  },
  validations: {
    permissionModel: {},
  },
  created: function () {
    if (this.$props.dataItem) {
      this.permissionModel = this.$props.dataItem;
    }
    if(this.$props.permissionChannelKeys != null){
      this.permissionChannelKeyList = this.$props.permissionChannelKeys;
    }
    this.action = this.$props.dialogTitle;
    if (this.permissionModel.id != undefined) this.isEdit = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
       console.log("SAVED");
         this.errors = [];
         let accessLevelsList =[];
         let errorArray = [];
          var table=$("#accessLevelTable")[0];  
        var rowCount = table.rows.length;
        for(var i=0;i<rowCount;i++){
            var row= table.rows[i];
            var accessLevel = row.cells[0].childNodes[0].value.trim();
            var accessLevelDescription = row.cells[1].childNodes[0].value.trim();
            if((accessLevel == "" && accessLevelDescription != "") || (accessLevel != "" && accessLevelDescription == "")){
                errorArray.push(true);
            }else{
              if(accessLevel != "" && accessLevelDescription != ""){
                var accessLevelData = {
                    accessLevel: accessLevel,
                    accessDescription:accessLevelDescription,
                };
                
                accessLevelsList.push(accessLevelData);
              }
              errorArray.push(false);
            }
            this.permissionModel.accessLevels = accessLevelsList;
        }
        
      if(this.permissionModel.channelKey == "" || this.permissionModel.channelKey == "Select" || this.permissionModel.channelKey == undefined){
        this.errors.push("Please select a Channel Key.");
      }
      if($.trim(this.permissionModel.permissionName) == "" || this.permissionModel.channelKey == undefined){
        this.errors.push("Please enter a Permission Name.");
      }
      if(errorArray.includes(true)){
        this.errors.push("Please enter all Access level related data.");
      }
      if(this.permissionModel.channelKey && this.permissionModel.permissionName && this.permissionModel.description && !errorArray.includes(true)){
        this.errors = [];
        this.$emit("save");
      }
      
      e.preventDefault();
    },
    onChangeChannelKey(event){
       this.permissionModel.channelKey = event.sender.wrapper[0].innerText;
       this.permissionModel.channelID = event.sender._valueBeforeCascade;
    },
    addRow(accessLevelName,accessLevelDescription) { 
    var table = $("#accessLevelTable")[0];  
    var rowCount = table.rows.length;  
    var row = table.insertRow(rowCount);  
    //Column 1  
    var cell1 = row.insertCell(0);  
    var element1 = document.createElement("input");  
    element1.type = "text";
    element1.placeholder = "Access Level Name";
    element1.setAttribute("class","k-textbox");
    //element1.setAttribute("required",true);
    if(accessLevelName){
        element1.setAttribute('value', accessLevelName);
        element1.setAttribute("disabled",true);
    }else{
      element1.removeAttribute("disabled"); 
    }
    cell1.appendChild(element1);
    //Column 2 
    var cell2 = row.insertCell(1);  
    var element2 = document.createElement("input");  
    element2.type = "text";  
    element2.placeholder = "Access Level Description";
    element2.setAttribute("class","k-textbox");
    //element2.setAttribute("required",true);
    if(accessLevelDescription){
        element2.setAttribute('value', accessLevelDescription);
    }
    cell2.appendChild(element2);
    //enable remove row button
    var removeBtn=document.getElementById("removeRowBtn");
    if(removeBtn && removeBtn.disabled){
        removeBtn.removeAttribute("disabled"); 
    }
    },
    removeRow() {  
    try {  
        var table = $("#accessLevelTable")[0];  
        var rowCount = table.rows.length;  
        if(rowCount > 1){
        table.deleteRow(rowCount-1); 
        rowCount--;
        }
        // Disable remove row button if only 1 row is left
        if(rowCount == 1){
        var removeBtn=document.getElementById("removeRowBtn");
        removeBtn.setAttribute("disabled",true);
        } 
    } catch (e) {  
        console.log(e)
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
  margin-bottom: 0px!important;
}

.maxHeightTable{
    height: 200px;
    overflow-y: auto;
}

.btn-add-row{
    left: 10px;
    bottom: 3px;
}

.btn-remove-row{
    left: 20px;
    bottom: 3px;
}
</style>