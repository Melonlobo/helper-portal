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
        <input type="hidden" v-model="notificationChannelModel.id">
        <input type="hidden" v-model="notificationChannelModel.applicationID">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Channel Key<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'channelKey'"
              v-model="notificationChannelModel.channelKey"
              class="form-control"
              required
              :disabled="isEdit"
            ></k-input>
          </div>
        </div>
        <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Channel Description<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'description'"
              v-model="notificationChannelModel.description"
              class="form-control"
              required
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }" v-if="!isEdit">
          <label class="col-sm-3 text-left col-form-label">
            Application Key<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
             <dropdownlist 
                          :data-source="notificationApplicationList"   
                          :option-label="'Select'" 
                          :name="'applicationKey'"  
                          :data-text-field="'applicationKey'"
                          :data-value-field="'id'"    
                          v-model="notificationChannelModel.applicationID"
                          @change="onChangeApplicationKey">
                        </dropdownlist>
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
    notificationApplicationKeys: Array
  },
  mounted: async function(){
    
  },
  data: function () {
    return {
       base_url_management:this.$config.reportApiManagementUrl,
      notificationChannelModel: {
        id: "",
        channelKey: undefined,
        Description: undefined,
        applicationID: undefined,
        applicationKey: undefined
      },
      errors: [],
      notificationApplicationList: undefined,
      isEdit: false,
      action: ""
    };
  },
  validations: {
    notificationChannelModel: {},
  },
  created: function () {
    if (this.$props.dataItem) {
      this.notificationChannelModel = this.$props.dataItem;
    }
    if(this.$props.notificationApplicationKeys != null){
      this.notificationApplicationList = this.$props.notificationApplicationKeys;
    }
    this.action = this.$props.dialogTitle;
    if (this.notificationChannelModel.id != undefined) this.isEdit = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
       console.log("SAVED");
         this.errors = [];
      if(this.notificationChannelModel.applicationKey == "" || this.notificationChannelModel.applicationKey == "Select" || this.notificationChannelModel.applicationKey == undefined){
        this.errors.push("Please select an Application Key.");
      }
      if(this.notificationChannelModel.applicationKey && this.notificationChannelModel.channelKey){
        this.errors = [];
        this.$emit("save");
      }
      
      e.preventDefault();
    },
    onChangeApplicationKey(event){
       this.notificationChannelModel.applicationKey = event.sender.wrapper[0].innerText;
       this.notificationChannelModel.applicationID = event.sender._valueBeforeCascade;
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