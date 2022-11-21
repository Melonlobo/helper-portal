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
        <input type="hidden" v-model="fileProviderModel.id">
        <input type="hidden" v-model="fileProviderModel.filePoolID">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }" >
          <label class="col-sm-3 text-left col-form-label">
            Provider Name<span class="c-danger" v-if="!isEdit">*</span>:
          </label>
          <div class="col-sm-9" v-if="!isEdit">
            <k-input
              type="text"
              :name="'name'"
              v-model="fileProviderModel.name"
              class="form-control"
              required
            ></k-input>
          </div>
           <div class="col-sm-9 text-left" v-else>
            <label class="display-data">{{fileProviderModel.name}}</label>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Provider Type<span class="c-danger" v-if="!isEdit">*</span>:
          </label>
          <div class="col-sm-9" v-if="!isEdit"> 
            <k-input
              type="text"
              :name="'type'"
              v-model="fileProviderModel.type"
              class="form-control"
              required
            ></k-input>
          </div>
           <div class="col-sm-9" v-else>
            <label class="display-data">{{fileProviderModel.type}}</label>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Configuration<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'configuration'"
              v-model="fileProviderModel.configuration"
              placeholder="Eg. ServerUrl=http://www.example.com;BucketName=exampleName;AccessKey=1234;"
              class="form-control"
              required
            ></k-input>
          </div>
        </div>
         <div class="form-group row" :style="{ marginBottom: '1rem' }" v-if="!isEdit">
          <label class="col-sm-3 text-left col-form-label">
            Pool Name<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <dropdownlist class="form-control"
                          :data-source="filePoolList" 
                          :name="'filePoolName'"  
                          :option-label="'Select'"   
                          v-model="fileProviderModel.filePoolName"
                          :data-text-field="'name'"
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
    filePoolNames: Array
  },
  data: function () {
    return {
      filePoolList: undefined,
      fileProviderModel: {
        id: "",
        name: undefined,
        type: undefined,
        configuration: undefined,
        filePoolname: undefined,
        filePoolID: undefined
      },
      errors: [],
      isEdit: false,
      action: "",
      ddlDefault: {
        id: "",
        name: "Select",
      },
    };
  },
  validations: {
    fileProviderModel: {},
  },
  created: function () {
    if (this.$props.dataItem) {
      this.fileProviderModel = this.$props.dataItem;
    }
    if(this.$props.filePoolNames != null){
      this.filePoolList = this.$props.filePoolNames;
    }
    this.action = this.$props.dialogTitle;
    if (this.fileProviderModel.id != undefined) this.isEdit = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
      console.log("SAVED");
         this.errors = [];
         if(!this.isEdit){
      if(this.fileProviderModel.filePoolName.name == "" || this.fileProviderModel.filePoolName.name == "Select" || this.fileProviderModel.filePoolName.name == undefined){
        this.errors.push("Please select a Pool Name.");
      }
      if(this.fileProviderModel.filePoolName && this.fileProviderModel.configuration && this.fileProviderModel.type && this.fileProviderModel.name){
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