<template>
  <td class="k-command-cell" role="gridcell">
    <button class="btn btn-primary-outline k-grid-edit-command" @click="editHandler" v-if="!hideUpdateBtn">
    <h5><i class="far fa-edit" ></i></h5>
    </button>
    
    <button class="btn btn-primary-outline k-grid-remove-command" @click="removeHandler">
      <h5><i class="far fa-trash-alt "></i></h5>
    </button>
  </td>
</template>
<script>
export default {
  data: function(){
    return {
      name:undefined,
      hideUpdateBtn: false
    };
  },
  props: {
    field: String,
    dataItem: Object,
    format: String,
    className: String,
    columnIndex: Number,
    columnsCount: Number,
    rowType: String,
    level: Number,
    expanded: Boolean,
    editor: String,
    hideUpdate: Boolean
  },
  created: function(){
    if(this.$props.hideUpdate){
      this.hideUpdateBtn = this.$props.hideUpdate;
    }
  },
  methods: {
    editHandler: function () {
      this.$emit("edit", this.dataItem);
    },
    removeHandler: function () {
      //if (confirm("Confirm deleting: " + this.name)) {
        this.$emit("remove", this.dataItem);
      //}
    },
  },
};
</script>