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
        <input type="hidden" v-model="applicationModel.id">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }">
          <label class="col-sm-3 text-left col-form-label">
            Application Key<span class="c-danger">*</span>:
          </label>
          <div class="col-sm-9">
            <k-input
              type="text"
              :name="'applicationKey'"
              v-model="applicationModel.applicationKey"
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
import "@progress/kendo-ui/js/kendo.core";
export default {
  components: {
    "k-input": Input,
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
  },
  props: {
    dataItem: Object,
    dialogTitle: String,
  },
  data: function () {
    return {
      errors: [],
      applicationModel: {
        id: "",
        applicationKey: undefined,
      },
      isEdit: false,
      action: "",
    };
  },
  validations: {
    applicationModel: {},
  },
  created: function () {
    if (this.$props.dataItem) {
      this.applicationModel = this.$props.dataItem;
    }
    this.action = this.$props.dialogTitle;
    if (this.applicationModel.id != undefined) this.isEdit = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      // console.log("SAVED");
      // this.$emit("save");
       this.errors = [];
       debugger
      if($.trim(this.applicationModel.applicationKey) == "" ){
        this.applicationModel.applicationKey = undefined;
        this.errors.push("Please enter an Application Key.");
      }
      if(this.applicationModel.applicationKey){
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