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
        <input type="hidden" v-model="auditEntityModel.id">
        <input type="hidden" v-model="auditEntityModel.applicationId">
      <div style="width: 50vw">
        <div
          class="form-group row"
          :style="{ marginBottom: '1rem' }"
          v-if="!isEdit"
        >
          <label class="col-sm-3 text-left col-form-label"> Application Key<span class="c-danger">*</span>: </label>
          <div class="col-sm-9">
            <dropdownlist class="form-control"
                          :data-source="appKeyList" 
                          :name="'applicationKey'"
                          :data-text-field="'key'"
                        :data-value-field="'id'"  
                          :option-label="'Select'"   
                          v-model="auditEntityModel.applicationKey"
                         
                          >
                        </dropdownlist>
                        <!-- <select id="ddlKey" class="form-control">
                          <option v-for="(data,index) in appKeyList" :key="index" :value="data">{{data}}</option>
                        </select> -->
          </div>
        </div>
        <div class="form-group row" :style="{ marginBottom: '1rem' }" v-if="!isEdit">
          <label class="col-sm-3 text-left col-form-label">
            Entity Name<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'entityName'"
              v-model="auditEntityModel.entityName"
              class="form-control"              
              required
            ></k-input>
          </div>
        </div>
        <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
           Fields<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'fields'"
              v-model="auditEntityModel.fields"
              class="form-control"
              placeholder="Comma seperated values Eg. Name,Age"
              required
            ></k-input>
          </div>
        </div>        
      </div>
      <!-- <input type="submit" id="submit-form" class="d-none" /> -->    
      <div class="d-flex ">
        <button class="k-button col-6" @click="cancel" >Cancel</button>
        
      <button type="submit" class="k-button k-primary col-6 mb-0" tabindex="0">Save</button>
    </div>    
    </form>
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
import axios from 'axios'
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
    applicationKeys: Array
  },
  data: function () {
    return {
      appKeyList: undefined,
      errors: [],
      auditEntityModel: {
        id: "",
        entityName: undefined,
        fields: undefined,
        applicationKey: undefined,
        applicationId: undefined
      },
      base_url: "http://auditlogapi.novigodemo.com/api/auditlog/",    
      base_url_management: "http://auditlogapi.novigodemo.com/api/auditlogmanagement/",
      isEdit: false,
      action: "",
    };
  },
  beforeMount:function(){
  },
  mounted:function(){
    if(this.$props.applicationKeys != null){
     this.appKeyList = this.$props.applicationKeys;
   }else{
     this.appKeyList = [];
   }
  },
  validations: {
    auditEntityModel: {},
  },
  created: function () {
     if (this.$props.dataItem) {
      this.auditEntityModel = this.$props.dataItem;
    }
    this.action = this.$props.dialogTitle;
    if (this.auditEntityModel.id != undefined) this.isEdit = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
      console.log("SAVED");
      this.errors = [];
      if(this.auditEntityModel.applicationKey == "" || this.auditEntityModel.applicationKey == "Select" || this.auditEntityModel.applicationKey == undefined){
        this.errors.push("Please select an Application Key.");
      }
          if($.trim(this.auditEntityModel.entityName) == ""){
           this.auditEntityModel.entityName = undefined;
        this.errors.push("Please enter an Entity Name.");
      }
      if($.trim(this.auditEntityModel.fields) == "" ){
        this.auditEntityModel.fields = undefined;
        this.errors.push("Please enter the fields.");
      }
      if(this.auditEntityModel.applicationKey && this.auditEntityModel.entityName && this.auditEntityModel.fields){
        this.errors = [];
        this.$emit("save");
      }
      e.preventDefault();
    }
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
</style>