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
        <input type="hidden" v-model="smsChannelModel.id">
        <input type="hidden" v-model="smsChannelModel.smsPoolID">
        <input type="hidden" v-model="smsChannelModel.smsProviderID">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Channel Key<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'key'"
              v-model="smsChannelModel.key"
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
            <!-- <k-input
              type="text"
              :name="'smsPoolName'"
              v-model="smsChannelModel.smsPoolName"
              class="form-control"
              required
            ></k-input> -->
             <dropdownlist 
                          :data-source="smsPoolList"   
                          :option-label="'Select'" 
                          :name="'smsPoolName'"  
                          :data-text-field="'name'"
                          :data-value-field="'id'"    
                          v-model="smsChannelModel.smsPoolID"
                          @change="onChangePoolName">
                        </dropdownlist>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Provider Name<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <!-- <k-input
              type="text"
              :name="'smsProviderName'"
              v-model="smsChannelModel.smsProviderName"
              class="form-control"
              required
            ></k-input> -->
              <dropdownlist
                          ref="dropdownlist"
                          :data-source="smsProviderList"   
                          :option-label="'Select'" 
                          :name="'smsProviderName'"     
                          :data-text-field="'name'"
                          :data-value-field="'id'"    
                          v-model="smsChannelModel.smsProviderID"
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
    smsPoolNames: Array
  },
  mounted: async function(){
    if(this.isEdit){
      var response = await axios.get(this.base_url_management + "GetSMSProviderNames/"+this.smsChannelModel.smsPoolID);
        if(response.data.result != null && response.data.result.length > 0){
          this.smsProviderList =response.data.result;
           var dropdown = this.$refs.dropdownlist.kendoWidget();
           dropdown.dataSource.data(response.data.result);
            dropdown.value(this.smsChannelModel.smsProviderID);
        }else{
           this.smsProviderList = [];
        }
       
        //   this.base_url_management + "GetSMSProviderNames/"+this.smsChannelModel.smsPoolID).then((response) => { 
        //       if(response.data.result != null && response.data.result.length > 0){ 
        //       this.smsProviderList =response.data.result;
        //       }else{
        //           this.smsProviderList = [];
        //       }
        //       var dropdown = this.$refs.dropdownlist.kendoWidget();
        //       dropdown.value(this.smsChannelModel.smsProviderID);
        // });
    }
    
  },
  data: function () {
    return {
       base_url_management:this.$config.smsApiManagementUrl,
      smsChannelModel: {
        id: "",
        name: undefined,
        smsPoolName: undefined,
        smsPoolID: undefined,
        smsProviderName: undefined,
        smsProviderID: undefined
      },
      selectedProviderID: undefined,
      errors: [],
      smsPoolList: undefined,
      smsProviderList: undefined,
      isEdit: false,
      action: ""
    };
  },
  validations: {
    smsChannelModel: {},
  },
  created: function () {
    if (this.$props.dataItem) {
      this.smsChannelModel = this.$props.dataItem;
    }
    if(this.$props.smsPoolNames != null){
      this.smsPoolList = this.$props.smsPoolNames;
    }
    this.action = this.$props.dialogTitle;
    if (this.smsChannelModel.id != undefined) this.isEdit = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
       console.log("SAVED");
         this.errors = [];
         if(!this.isEdit){
      if(this.smsChannelModel.smsPoolName == "" || this.smsChannelModel.smsPoolName == "Select" || this.smsChannelModel.smsPoolName == undefined){
        this.errors.push("Please select a Pool Name.");
      }
      if(this.smsChannelModel.smsProviderName == "" || this.smsChannelModel.smsProviderName == "Select" || this.smsChannelModel.smsProviderName == undefined){
        this.errors.push("Please select a Provider Name.");
      }
      if(this.smsChannelModel.smsPoolName && this.smsChannelModel.smsProviderName && this.smsChannelModel.key){
        this.errors = [];
        this.$emit("save");
      }
      }else{
         if(this.smsChannelModel.smsProviderName == "" || this.smsChannelModel.smsProviderName == "Select" || this.smsChannelModel.smsProviderName == undefined){
        this.errors.push("Please select a Provider Name.");
        }
        if(this.smsChannelModel.smsProviderID){
         this.$emit("save");
       }
      }
      e.preventDefault();
    },
    onChangePoolName(event){
       this.smsChannelModel.smsPoolName = event.sender.wrapper[0].innerText;
       this.smsChannelModel.smsPoolID = event.sender._valueBeforeCascade;
       console.log(this.base_url_management + "GetSMSProviderNames/"+this.smsChannelModel.smsPoolID)
        if(this.smsChannelModel.smsPoolName != "Select" && this.smsChannelModel.smsPoolName != undefined && this.smsChannelModel.smsPoolName != null){
        axios.get(
          this.base_url_management + "GetSMSProviderNames/"+this.smsChannelModel.smsPoolID).then((response) => { 
              if(response.data.result != null && response.data.result.length > 0){ 
              this.smsProviderList =response.data.result;
              }else{
                  this.smsProviderList = [];
              }
              this.smsChannelModel.smsProviderID = null;
        console.log(response.data.result);
        });
           }
           else{
               this.smsProviderList = [];
               this.smsChannelModel.smsProviderName = null;
           }
    },
    onChangeProviderName(event){
this.smsChannelModel.smsProviderName = event.sender.wrapper[0].innerText;
this.smsChannelModel.smsProviderID = event.sender._valueBeforeCascade;
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