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
        <input type="hidden" v-model="emailTemplateModel.id">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Template Name<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'name'"
              v-model="emailTemplateModel.name"
              class="form-control"
              required
              :disabled="isEdit"
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Variant:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'variant'"
              v-model="emailTemplateModel.variant"
              class="form-control"
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Sender:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'sender'"
              v-model="emailTemplateModel.sender"
              class="form-control"
            ></k-input>
          </div>
        </div>
        <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Message Template<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'messageTemplate'"
              v-model="emailTemplateModel.messageTemplate"
              class="form-control"
              placeholder="Eg. Hi {User}, {Body}"
              required
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }" v-if="!isEdit">
          <label class="col-sm-3 text-left col-form-label">
            Pool Name<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
              <dropdownlist
                          :data-source="emailPoolNameList"      
                           :option-label="ddlDefault"   
                      :data-text-field="'name'"
                          :data-value-field="'id'"
                          @change="onChangePoolName">
                        </dropdownlist>
          </div>
        </div>
      </div>
      <button class="k-button  k-primary btn-popup mr-10" @click="cancel">Cancel</button>
      <button class="k-button k-primary btn-popup" type="submit" tabindex="0">Save</button>
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
    emailPoolNames: Array
  },
  data: function () {
    return {
      ddlDefault: {
        id: "",
        name: "Select",
      },
      emailPoolNameList: [],
      errors: [],
      emailTemplateModel: {
        id: "",
        name: undefined,
        variant: undefined,
        sender: undefined,
        emailPoolID: undefined,
        messageTemplate: undefined
      },
      isEdit: false,
      action: "",
    };
  },
  validations: {
    emailTemplateModel: {},
  },
  created: function () {
    if (this.$props.dataItem) {
      this.emailTemplateModel = this.$props.dataItem;
    }
    if(this.$props.emailPoolNames){
      this.emailPoolNameList = this.$props.emailPoolNames
    }
    this.action = this.$props.dialogTitle;
    if (this.emailTemplateModel.id != undefined) this.isEdit = true;
  },
  methods: {
    onChangePoolName(event){
this.emailTemplateModel.emailPoolName = event.sender.wrapper[0].innerText;
this.emailTemplateModel.emailPoolID = event.sender._valueBeforeCascade;
    },
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
      console.log("SAVED");
         this.errors = [];
         if(!this.isEdit){
      if(!this.emailTemplateModel.emailPoolName || this.emailTemplateModel.emailPoolName != undefined && (this.emailTemplateModel.emailPoolName == "" || this.emailTemplateModel.emailPoolName == "Select" || this.emailTemplateModel.emailPoolName == undefined)){
        this.errors.push("Please select a Pool Name.");
      }
      if(this.emailTemplateModel.emailPoolName && this.emailTemplateModel.messageTemplate){
        if(this.emailTemplateModel.variant == undefined){
          this.emailTemplateModel.variant = null
        }
        if(this.emailTemplateModel.sender == undefined){
          this.emailTemplateModel.sender = null
        }
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
</style>