<template>
  <k-dialog @close="cancel" :max-width="400" title="Confirmation" :width="500">
    <div>
          <p v-if="this.model.name" class="text-left">Are you sure you want to delete {{this.model.name}}?</p>
          <p v-else-if="this.model.entityName" class="text-left">Are you sure you want to delete {{this.model.entityName}}?</p>
          <p v-else class="text-left">Are you sure you want to delete {{this.model.key}}?</p>
      </div>   
       <button class="k-button k-primary btn-popup mr-10" @click="cancel">Cancel</button> 
       <button class="k-button k-primary btn-popup" @click="confirm">Confirm</button> 
  </k-dialog>
</template>
<script>
import { Dialog } from "@progress/kendo-vue-dialogs";
export default {
    
  components: {
      "k-dialog": Dialog,
  },
  props: {
    dataItem: Object
  },
  data: function () {
    return {
        model: undefined
    };
  },
  created: function () {
    if (this.$props.dataItem) {
      this.model = this.$props.dataItem;
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm(){
        this.$emit("confirm",this.model);
    }
  },
};
</script>