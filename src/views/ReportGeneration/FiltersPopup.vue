<template>
  <k-dialog @close="cancel" :max-width="400" title="Add Filters">
      <div class="row c-danger ml-0">
          <p v-if="errors.length > 0" class="text-left">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="(error,index) in errors" :key="index">{{ error }}</li>
            </ul>
          </p>
      </div>
    <form class="k-form" @submit.prevent="save">
      <div style="width: 50vw">
        <div class="form-group row" :style="{ marginBottom: '1rem' }">
         <table class="table text-left mb-0">

                <tr class="text-left">
                    <td><label>Filters</label>  
                                    <div class="d-md-inline d-flex">
   
                    <button class="k-button k-primary btn-add-row" type="button" tabindex="0" @click="addRow(null)">Add Row</button>
                         <button id="removeRowBtn" class="k-button k-primary btn-remove-row" disabled type="button" tabindex="0" @click="removeRow">Remove Last Row</button>                   
                                    </div>
                    </td>       
                </tr>
                <tr>
                     <td>
                         <div class="maxHeightTable">
                        <table id="filterTable">
                            <tr>
                                <td><input placeholder="Field Name" id="dataPartKey" class="k-textbox" required/></td>
                                <td><input placeholder="Operator" id="dataPartOperator" class="k-textbox" required/></td>
                                <td><input placeholder="Value" id="dataPartValue" class="k-textbox" required/></td>
                                <td><input placeholder="Data Type" id="dataPartDataType" class="k-textbox" required/></td>
                            </tr>
                        </table>
                        </div>
                    </td>   
                </tr>
            </table>
        </div>
      </div>
    <div class="d-flex">
      <button class="k-button col-6 btn-popup" @click="cancel" >Cancel</button>
      <button type="submit" class="k-button k-primary col-6 btn-popup mb-0" tabindex="0">Save</button>
    </div>    
    </form>
      
  </k-dialog>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Input } from "@progress/kendo-vue-inputs";
import { required } from "vuelidate/lib/validators";

export default {
  components: {
    "k-input": Input,
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar
  },
  props: {
    dataItems: Array,
  },
  data: function () {
    return {
        errors: [],
        filtersList: undefined
    };
  },
  created: function () {
    if (this.$props.dataItems) {
      this.filtersList = this.$props.dataItems;
    }
  },
  mounted: function(){
      if(this.filtersList.length > 0){
          $("#dataPartKey").val(this.filtersList[0].fieldName);
        $("#dataPartOperator").val(this.filtersList[0].operator);
        $("#dataPartValue").val(this.filtersList[0].value);
        $("#dataPartDataType").val(this.filtersList[0].dataType);
      }
      if(this.filtersList.length > 1){
          for (var i=1;i<this.filtersList.length;i++){
            this.addRow(this.filtersList[i].fieldName, this.filtersList[i].operator, this.filtersList[i].value, this.filtersList[i].dataType)
        }
      }
      
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save(e) {
      console.log("SAVED");
      var filters = [];
      var filtersErrorArray = [];
      var table=$("#filterTable")[0];  
        var rowCount = table.rows.length;
        for(var i=0;i<rowCount;i++){
            var row= table.rows[i];
            var key = row.cells[0].childNodes[0].value.trim();
            var operator = row.cells[1].childNodes[0].value.trim();
            var value = row.cells[2].childNodes[0].value.trim();
            var dataType = row.cells[3].childNodes[0].value.trim();
            if(key == "" && value == "" && operator == "" && dataType == ""){
                filtersErrorArray.push(true);
            }else{
                var filter = {
                    fieldName: key,
                    operator:operator,
                    value:value,
                    dataType: dataType
                };
                filtersErrorArray.push(false);
                filters.push(filter);
            }
        }
         if(filtersErrorArray.includes(true)){
          this.errors.push('Please enter all the Filter Data.');
        }else{
            this.$emit("saveFilters", filters);
        }
        e.preventDefault();
    },
    addRow(fieldNameValue,operatorValue,valueData,dataTypeValue) {  
    var table = $("#filterTable")[0];  
    var rowCount = table.rows.length;  
    var row = table.insertRow(rowCount);  
    //Column 1  
    var cell1 = row.insertCell(0);  
    var element1 = document.createElement("input");  
    element1.type = "text";
    element1.placeholder = "Field Name "+rowCount;
    element1.setAttribute("class","k-textbox");
    element1.setAttribute("required",true);
    if(fieldNameValue){
        element1.setAttribute('value', fieldNameValue);
    }
    cell1.appendChild(element1);
    //Column 2 
    var cell2 = row.insertCell(1);  
    var element2 = document.createElement("input");  
    element2.type = "text";  
    element2.placeholder = "Operator";
    element2.setAttribute("class","k-textbox");
    element2.setAttribute("required",true);
    if(operatorValue){
        element2.setAttribute('value', operatorValue);
    }
    cell2.appendChild(element2);
    // Column 3
    var cell3 = row.insertCell(2);  
    var element3 = document.createElement("input");  
    element3.type = "text";  
    element3.placeholder = "Value";
    element3.setAttribute("class","k-textbox");
    element3.setAttribute("required",true);
    if(valueData){
        element3.setAttribute('value', valueData);
    }
    cell3.appendChild(element3);
     // Column 4
    var cell4 = row.insertCell(3);  
    var element4 = document.createElement("input");  
    element4.type = "text";  
    element4.placeholder = "Data Type";
    element4.setAttribute("class","k-textbox");
    element4.setAttribute("required",true);
    if(dataTypeValue){
        element4.setAttribute('value', dataTypeValue);
    }
    cell4.appendChild(element4);
    //enable remove row button
    var removeBtn=document.getElementById("removeRowBtn");
    if(removeBtn.disabled){
        removeBtn.removeAttribute("disabled"); 
    }
    },
    removeRow() {  
    try {  
        var table = $("#filterTable")[0];  
        var rowCount = table.rows.length;  
        if(rowCount > 1){
        table.deleteRow(rowCount-1); 
        rowCount--;
        }
        // Disable remove row button if only 1 row is left
        if(rowCount == 1){
        var removeBtn=document.getElementById("removeRowBtn");
        removeBtn.setAttribute("disabled",true);
        } 
    } catch (e) {  
        console.log(e)
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
.maxHeightTable{
    height: 285px;
    overflow-y: auto;
}
.btn-add-row{
    left: 10px;
    bottom: 3px;
}

.btn-remove-row{
    left: 20px;
    bottom: 3px;
}
</style>