<template>
  <k-dialog @close="okClick" :max-width="400" title="Errors" :width="500">
    <div class="row c-danger ml-0">
          <p v-if="errors.length > 0" class="text-left">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="(error,index) in errorList" :key="index">{{ error }}</li>
            </ul>
          </p>
      </div>   
       <button class="k-button k-primary btn-popup" @click="okClick">Ok</button> 
  </k-dialog>
</template>
<script>
import { Dialog } from "@progress/kendo-vue-dialogs";
export default {
    
  components: {
      "k-dialog": Dialog,
  },
  props: {
    errors: Array
  },
  data: function () {
    return {
        errorList: []
    };
  },
  created: function () {
    if (this.$props.errors) {
      this.errorList = this.$props.errors;
    }
  },
  methods: {
    okClick() {
      this.$emit("cancel");
    }    
  },
};
</script>
<style scoped>
p{
  margin-bottom: 0px!important;
}
</style>