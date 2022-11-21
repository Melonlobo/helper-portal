<template>
    <div class="send-email">
        <div class="container-fluid">
        <div class="panel-heading">
             <h2 class="text-left">Insert Report Data</h2>
            <form class="k-form" @submit.prevent="validateForm">
                   <div class="row" >
                <div class="col-sm-6">
              <table class="table text-left mb-0 sm-font">
                    <colgroup>
                         <col span="1" style="width: 100px" />
                        <col span="1" style="width: 100px" />
                    </colgroup>
                <tr>
                    <td><label>Channel Key<span class="c-danger">*</span></label></td>
                    <td>
                        <dropdownlist
                            :style="{'font-size': '12px'}"
                            class="custom-input-width"
                          :data-items="reportGenerationChannelKeys"   
                          :default-item="ddlDefault"   
                      :text-field="'key'"
                          :data-item-id="'id'"         
                          v-model="insertReportModel.channelKey"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                        </td>
                                       
                </tr>
                <tr>
                    <td><label>Entity name<span class="c-danger">*</span></label></td>
                    <td>
                         <k-input class="custom-input-width"
                            type="text"
                            :name="'entityName'"
                            v-model="insertReportModel.entityName"
                            required
                        ></k-input>
                    </td>
                </tr>             
            </table>
                </div>

                <div class="col-sm-6">
              <table class="table text-left mb-0">

                <tr class="text-left">
                    <td><label>Data<span class="c-danger">*</span></label>  
                                    <div class="d-md-inline d-flex">
   
                    <button class="k-button k-primary btn-add-row" type="button" tabindex="0" @click="addRow">Add Row</button>
                         <button id="removeRowBtn" class="k-button k-primary btn-remove-row" disabled type="button" tabindex="0" @click="removeRow">Remove Last Row</button>                   
                                    </div>
                    </td>       
                </tr>
                <tr>
                     <td>
                         <div class="maxHeightTable">
                        <table id="dataTable">
                            <tr>
                                <td><input placeholder="key" id="dataPartKey" class="k-textbox" required/></td>
                                <td><input placeholder="value" id="dataPartValue" class="k-textbox" required/></td>
                            </tr>
                        </table>
                        </div>
                    </td>   
                </tr>                   
                <tr><div id="btnDiv">
       <button class="col-4 k-button k-primary btn-popup mr-10" type="submit" tabindex="0">Save</button>
                     <button class="col-4 k-button k-primary btn-popup" type="button" tabindex="0" @click="resetForm">Reset</button>
                                                </div>
                            </tr>
            </table>
                </div>
            </div>
            </form>
        </div>
         <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
         <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { Input } from "@progress/kendo-vue-inputs";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import MessagePopup from "../shared/MessagePopup.vue";

export default({
    name:"InsertReportData", 
    components: {
    "k-input": Input,
     dropdownlist: DropDownList, 
     "error-popup":ErrorPopup,
     "message-popup":MessagePopup
  },
    data() {
      return {
     base_url: this.$config.reportApiUrl,
       base_url_management:this.$config.reportApiManagementUrl,
        reportGenerationChannelKeys:[],
        errors: [],
        ddlDefault: {
        id: "",
        key: "Select",
        name:"Select"
      },
        messageModel:undefined,
      insertReportModel: {
          channelKey: {
                        id:"",
                        key:"Select"
                        },
          entityName: "",
      }
    };
    },
    beforeMount: function(){
        this.getReportGenerationChannelKeys();
    },
    methods:{
         async getReportGenerationChannelKeys(){
        try{
        const response = await axios.get(this.base_url_management + "GetChannelKeys");
        if(response.data.status){
            this.reportGenerationChannelKeys = response.data.result;
        }else{
            this.reportGenerationChannelKeys = [];
        }
        }catch(err){
            console.log(err)
        }
    },
    validateForm(e){
        var messagePartsErrorArray = [];
        if(this.insertReportModel.channelKey && this.insertReportModel.channelKey.key && this.insertReportModel.channelKey.key == "Select"){
            this.insertReportModel.channelKey = undefined
        }
        var table=$("#dataTable")[0];  
        var rowCount = table.rows.length;
        for(var i=0;i<rowCount;i++){
            var row= table.rows[i];
            var key = row.cells[0].childNodes[0].value.trim();
            var value = row.cells[1].childNodes[0].value.trim();
            if(key == "" || value == ""){
                messagePartsErrorArray.push(true);
            }else{
                messagePartsErrorArray.push(false);
            }
        }
        if(this.insertReportModel.channelKey && this.insertReportModel.entityName && !messagePartsErrorArray.includes(true)){
            this.insertReportData();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.insertReportModel.channelKey) {
        this.errors.push('Please select a Channel Key.');
      }
      if (!this.insertReportModel.entityName || $.trim(this.insertReportModel.entityName) == "") {
        this.errors.push('Please enter a Collection Name.');
      }
      if(messagePartsErrorArray.includes(true)){
          this.errors.push('Please enter the Data.');
      }

      e.preventDefault();
    },
    async insertReportData(){
        var dataDictionary = {};
        var table=$("#dataTable")[0];  
        var rowCount = table.rows.length; 
        for(var i=0;i<rowCount;i++){
            var row= table.rows[i];
            var key = row.cells[0].childNodes[0].value;
            var value = row.cells[1].childNodes[0].value;
            dataDictionary[key] = value;
        }
        let data = {
            entityName : this.insertReportModel.entityName,
            channelkey: this.insertReportModel.channelKey.key,
            collectionData: dataDictionary,
        }
        await axios.post(this.base_url_management + "InsertReportData",data).then((response) => {
        if(response.data.status){
            this.resetForm();
            this.messageModel = response.data;
        }else{
            this.messageModel = response.data;
        }
        console.log(response);
      })
    },
    onChangeChannelKey(event) {
        this.insertReportModel.channelKey = event.target.value;
    },
    resetForm(){
        this.insertReportModel= {
          channelKey: {
                        id:"",
                        key:"Select"
                        },
          entityName: ""
      };
       var table=$("#dataTable")[0];  
        var rowCount = table.rows.length; 
        for(var i=0;i<rowCount;i++){
            this.removeRow();
        }
        $("#dataPartKey").val('');
        $("#dataPartValue").val('');
    },    
    errorPopupOk(){
      this.errors = [];
    },
    addRow() {  
    var table = $("#dataTable")[0];  
    var rowCount = table.rows.length;  
    var row = table.insertRow(rowCount);  
    //Column 1  
    var cell1 = row.insertCell(0);  
    var element1 = document.createElement("input");  
    element1.type = "text";
    element1.placeholder = "key"+rowCount;
    element1.setAttribute("class","k-textbox");
    element1.setAttribute("required",true);
   // element1.name = btnName;  
    //element1.setAttribute('value', 'Delete'); // or element1.value = "button";  
    // element1.onclick = function() {  
    //     removeRow(btnName);  
    // }  
    cell1.appendChild(element1);
    //Column 2 
    var cell2 = row.insertCell(1);  
    var element2 = document.createElement("input");  
    element2.type = "text";  
    element2.placeholder = "value";
    element2.setAttribute("class","k-textbox");
    element2.setAttribute("required",true);
    cell2.appendChild(element2);
    //enable remove row button
    var removeBtn=document.getElementById("removeRowBtn");
    if(removeBtn.disabled){
        removeBtn.removeAttribute("disabled"); 
    }
    },
    removeRow() {  
    try {  
        var table = $("#dataTable")[0];  
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
    messagePopupOk(){
        this.messageModel = undefined;
    }
    }
})
</script>
<style scoped>
table {
    border-collapse: separate;
    border-spacing: 0.5em 0.5em;
}
.form-table1{
	width: 37%;
    margin: 0px!important;
}

.form-table2{
    position: absolute;
    bottom:37px;
    left: 515px;
    height: 450px;
}


.maxHeightTable{
    height: 285px;
    overflow-y: auto;
}

table#messagePartsTable{
position: relative;
}

.btn-add-row{
    left: 10px;
    bottom: 3px;
}

.btn-remove-row{
    left: 20px;
    bottom: 3px;
}

.email-template-div{
    overflow-y: auto;
    height: 25px;
}

.custom-input-width{
    width: 50vh;
}
</style>