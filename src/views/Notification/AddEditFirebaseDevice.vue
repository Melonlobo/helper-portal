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
        <input type="hidden" v-model="firebaseDeviceModel.id">
        <input type="hidden" v-model="firebaseDeviceModel.channelID">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Reference ID 1<span class="c-danger" v-if="!isEdit">*</span>:
          </label>
          <div class="col-sm-9" v-if="!isEdit">
            <k-input
              type="text"
              :name="'referenceID1'"
              v-model="firebaseDeviceModel.referenceID1"
              class="form-control"
              required
            ></k-input>
          </div>
          <div class="col-sm-9 text-left" v-else>
            <label class="display-data">{{firebaseDeviceModel.referenceID1}}</label>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Reference ID 2<span class="c-danger" v-if="!isEdit">*</span>:
          </label>
          <div class="col-sm-9" v-if="!isEdit">
            <k-input
              type="text"
              :name="'referenceID2'"
              v-model="firebaseDeviceModel.referenceID2"
              class="form-control"
              required
            ></k-input>
          </div>
          <div class="col-sm-9" v-else>
            <label class="display-data">{{firebaseDeviceModel.referenceID2}}</label>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Registration Token<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'registrationToken'"
              v-model="firebaseDeviceModel.registrationToken"
              class="form-control"
              required
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Platform<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'platform'"
              v-model="firebaseDeviceModel.platform"
              class="form-control"
              required
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }" v-if="!isEdit">
          <label class="col-sm-3 text-left col-form-label">
            Channel Key<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <dropdownlist class="form-control"
                          :data-source="channelKeyList" 
                          :name="'channelKey'"  
                          :option-label="'Select'"   
                          v-model="firebaseDeviceModel.channelKey"
                          :data-text-field="'channelKey'"
                          :data-value-field="'id'" 
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
    channelKeys: Array
  },
  data: function () {
    return {
      channelKeyList: undefined,
      firebaseDeviceModel: {
        id: "",
        referenceID1: undefined,
        referenceID2: undefined,
        registrationToken: undefined,
        platform: undefined,
        channelKey: undefined,
        channelID: undefined
      },
      errors: [],
      isEdit: false,
      action: "",
      ddlDefault: {
        id: "",
        channelKey: "Select",
      },
    };
  },
  validations: {
    firebaseDeviceModel: {},
  },
  created: function () {
    debugger
    if (this.$props.dataItem) {
      this.firebaseDeviceModel = this.$props.dataItem;
    }
    if(this.$props.channelKeys != null){
      this.channelKeyList = this.$props.channelKeys;
    }
    this.action = this.$props.dialogTitle;
    if (this.firebaseDeviceModel.id != undefined) this.isEdit = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
      console.log("SAVED");
         this.errors = [];
         if(!this.isEdit){
           debugger;
      if(this.firebaseDeviceModel.channelKey == "" || this.firebaseDeviceModel.channelKey == "Select" || this.firebaseDeviceModel.channelKey == undefined){
        this.errors.push("Please select a Channel Key.");
      }
      if(this.firebaseDeviceModel.channelKey && this.firebaseDeviceModel.referenceID1 && this.firebaseDeviceModel.referenceID2 && this.firebaseDeviceModel.registrationToken && this.firebaseDeviceModel.platform){
        this.errors = [];
        this.$emit("save");
      }
      }else{
        this.$emit("save");
      }
      e.preventDefault();
      
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

.display-data{
  float:left;
  margin-top: 7px;
}
</style>