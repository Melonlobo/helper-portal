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
        <input type="hidden" v-model="smsQuotaModel.id">
        <input type="hidden" v-model="smsQuotaModel.smsChannelID">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Channel Key<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9" v-if="!isEdit">
              <dropdownlist class="form-control"
                          :data-source="smsChannelList" 
                          :name="'smsChannelKey'"  
                          :option-label="'Select'"   
                          v-model="smsQuotaModel.key"
                          :data-text-field="'key'"
                          :data-value-field="'id'" 
                          @change="onChangeChannelKey"
                          >
                        </dropdownlist>
          </div>
          <div v-else>
            {{this.smsQuotaModel.smsChannelKey}}
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Monthly Quota<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9" >
            <k-input
              type="number"
              :name="'monthlyQuota'"
              v-model="smsQuotaModel.monthlyQuota"
              class="form-control"
              required
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Total Quota<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="number"
              :name="'totalQuota'"
              v-model="smsQuotaModel.totalQuota"
              class="form-control"
              required
            ></k-input>
              
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
    smsChannelKeys: Array
  },
  mounted: async function(){
    
  },
  data: function () {
    return {
       base_url_management:this.$config.smsApiManagementUrl,
       smsChannelList: [],
       selectedSMSChannel: undefined,
      smsQuotaModel: {
        id: "",
         key: null,
        totalQuota: 0,
        monthlyQuota: 0,        
        isRestrictedByQuota: false
      },
      errors: [],
      isEdit: false,
      action: ""
    };
  },
  validations: {
    smsChannelModel: {},
  },
  created: function () {
    if (this.$props.dataItem) {
      this.smsQuotaModel = this.$props.dataItem;
    }
    if(this.$props.smsChannelKeys != null){
      this.smsChannelList = this.$props.smsChannelKeys;
    }
    this.action = this.$props.dialogTitle;
    if (this.smsQuotaModel.id != undefined) this.isEdit = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
       console.log("SAVED");
         this.errors = [];
          var monthlyQuota = parseInt(this.smsQuotaModel.monthlyQuota);
           var totalQuota = parseInt(this.smsQuotaModel.totalQuota);
         if(!this.isEdit){
           this.smsQuotaModel.key = this.selectedSMSChannel;
           if( this.smsQuotaModel.key == undefined ||  this.smsQuotaModel.key == "Select"){
             this.errors.push("Please select a Channel Key.");
           }
           if(monthlyQuota <= 0){
              this.errors.push("Monthly quota must be greater than zero");
           }
           if(totalQuota == 0 || totalQuota < -1){
              this.errors.push("Total quota must be greater than zero or -1");
           }
      if(this.smsQuotaModel.key && monthlyQuota > 0 && totalQuota != 0 && !(totalQuota < -1)){
        this.errors = [];
        this.$emit("save");
      }
      }else{
        this.smsQuotaModel.key = this.smsQuotaModel.smsChannelKey;
        if(monthlyQuota <= 0){
              this.errors.push("Monthly quota must be greater than zero");
           }
           if(totalQuota == 0 || totalQuota < -1){
              this.errors.push("Total quota must be greater than zero or -1");
           }
         if(this.smsQuotaModel.key && monthlyQuota > 0 && totalQuota != 0 && !(totalQuota < -1)){
        this.errors = [];
        this.$emit("save");
      }
       
      }
      e.preventDefault();
    },
    onChangeChannelKey(event){
      this.selectedSMSChannel = event.sender.wrapper[0].innerText;
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