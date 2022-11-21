<template>
  <k-dialog @close="okClick" :max-width="400" :title="title" :width="500">
    <div class="row ml-0 text-left popup-align-text">
          <p v-if="model.message">{{model.message}}</p>
          <p v-if="model.result != null && model.result.fileUrl"><b>File URL:</b> {{model.result.fileUrl}}</p>
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
  data(){
      return {
          title: undefined,
          messageModel:{
              id:"",
              message:"",
              status:false,
              fileUrl:""
          }
      };
  },
  props: {
    model: Object,
    responseStatus: Boolean
  },
  created(){
      if(this.$props.responseStatus != undefined){       
          this.title = this.$props.responseStatus ? "Success" : "Failure";
      }else{
        this.title = "Failure";
      }
      if(this.$props.model){
          this.messageModel = this.$props.model;
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
.popup-align-text{
  margin-right: 10px;
  word-break: break-all;
}
</style>