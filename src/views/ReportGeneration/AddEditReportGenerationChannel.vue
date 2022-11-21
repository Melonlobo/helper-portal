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
        <input type="hidden" v-model="reportGenerationChannelModel.id">
        <input type="hidden" v-model="reportGenerationChannelModel.poolID">
        <input type="hidden" v-model="reportGenerationChannelModel.providerID">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Channel Key<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'key'"
              v-model="reportGenerationChannelModel.key"
              class="form-control"
              required
              :disabled="isEdit"
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }" v-if="!isEdit">
          <label class="col-sm-3 text-left col-form-label">
            Pool Name<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
             <dropdownlist 
                          :data-source="reportGenerationPoolList"   
                          :option-label="'Select'" 
                          :name="'poolName'"  
                          :data-text-field="'name'"
                          :data-value-field="'id'"    
                          v-model="reportGenerationChannelModel.poolID"
                          @change="onChangePoolName">
                        </dropdownlist>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Provider Name<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
              <dropdownlist
                          ref="dropdownlist"
                          :data-source="reportGenerationProviderList"   
                          :option-label="'Select'" 
                          :name="'providerName'"     
                          :data-text-field="'name'"
                          :data-value-field="'id'"    
                          v-model="reportGenerationChannelModel.providerID"
                          @change="onChangeProviderName"
                          >
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
    reportGenerationPoolNames: Array
  },
  mounted: async function(){
    if(this.isEdit){
      var response = await axios.get(this.base_url_management + "GetProviderNames/"+this.reportGenerationChannelModel.poolID);
        if(response.data.result != null && response.data.result.length > 0){
          this.reportGenerationProviderList =response.data.result;
           var dropdown = this.$refs.dropdownlist.kendoWidget();
           dropdown.dataSource.data(response.data.result);
            dropdown.value(this.reportGenerationChannelModel.providerID);
        }else{
           this.reportGenerationProviderList = [];
        }
    }
    
  },
  data: function () {
    return {
       base_url_management:this.$config.reportApiManagementUrl,
      reportGenerationChannelModel: {
        id: "",
        name: undefined,
        poolName: undefined,
        poolID: undefined,
        providerName: undefined,
        providerID: undefined
      },
      selectedProviderID: undefined,
      errors: [],
      reportGenerationPoolList: undefined,
      reportGenerationProviderList: undefined,
      isEdit: false,
      action: ""
    };
  },
  validations: {
    reportGenerationChannelModel: {},
  },
  created: function () {
    if (this.$props.dataItem) {
      this.reportGenerationChannelModel = this.$props.dataItem;
    }
    if(this.$props.reportGenerationPoolNames != null){
      this.reportGenerationPoolList = this.$props.reportGenerationPoolNames;
    }
    this.action = this.$props.dialogTitle;
    if (this.reportGenerationChannelModel.id != undefined) this.isEdit = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
       console.log("SAVED");
         this.errors = [];
         if(!this.isEdit){
      if(this.reportGenerationChannelModel.poolName == "" || this.reportGenerationChannelModel.poolName == "Select" || this.reportGenerationChannelModel.poolName == undefined){
        this.errors.push("Please select a Pool Name.");
      }
      if(this.reportGenerationChannelModel.providerName == "" || this.reportGenerationChannelModel.providerName == "Select" || this.reportGenerationChannelModel.providerName == undefined){
        this.errors.push("Please select a Provider Name.");
      }
      if(this.reportGenerationChannelModel.poolName && this.reportGenerationChannelModel.providerName && this.reportGenerationChannelModel.key){
        this.errors = [];
        this.$emit("save");
      }
      }else{
         if(this.reportGenerationChannelModel.providerName == "" || this.reportGenerationChannelModel.providerName == "Select" || this.reportGenerationChannelModel.providerName == undefined){
        this.errors.push("Please select a Provider Name.");
        }
        if(this.reportGenerationChannelModel.providerID){
         this.$emit("save");
       }
      }
      e.preventDefault();
    },
    onChangePoolName(event){
       this.reportGenerationChannelModel.poolName = event.sender.wrapper[0].innerText;
       this.reportGenerationChannelModel.poolID = event.sender._valueBeforeCascade;
       console.log(this.base_url_management + "GetProviderNames/"+this.reportGenerationChannelModel.poolID)
        if(this.reportGenerationChannelModel.poolName != "Select" && this.reportGenerationChannelModel.poolName != undefined && this.reportGenerationChannelModel.poolName != null){
        axios.get(
          this.base_url_management + "GetProviderNames/"+this.reportGenerationChannelModel.poolID).then((response) => { 
              if(response.data.result != null && response.data.result.length > 0){ 
              this.reportGenerationProviderList =response.data.result;
              }else{
                  this.reportGenerationProviderList = [];
              }
              this.reportGenerationChannelModel.providerID = null;
        console.log(response.data.result);
        });
           }
           else{
               this.reportGenerationProviderList = [];
               this.reportGenerationChannelModel.providerName = null;
           }
    },
    onChangeProviderName(event){
this.reportGenerationChannelModel.providerName = event.sender.wrapper[0].innerText;
this.reportGenerationChannelModel.providerID = event.sender._valueBeforeCascade;
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