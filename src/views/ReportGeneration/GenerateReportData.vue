<template>
    <div class="send-email">
        <div class="container-fluid">
        <div class="panel-heading">
             <h2 class="text-left">Generate Report Data</h2>
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
                          v-model="generateReportModel.channelKey"
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
                            v-model="generateReportModel.entityName"
                            required
                        ></k-input>
                    </td>
                </tr>             
            </table>
                </div>

                <div class="col-sm-6">
              <table class="table text-left mb-0">

                <tr class="text-left">
                    <td><label>Filters</label>  
                                    <div class="d-md-inline d-flex">
                                        <button id="btnAddFilter" class="k-button k-primary btn-add-row" type="button" @click="openFilterPopup">Add Filters</button>
                    <!-- <button class="k-button k-primary btn-add-row" type="button" tabindex="0" @click="addRow">Add Row</button>
                         <button id="removeRowBtn" class="k-button k-primary btn-remove-row" disabled type="button" tabindex="0" @click="removeRow">Remove Last Row</button>                    -->
                                    </div>
                    </td>       
                </tr>
            </table>
                </div>
            </div>
            <div id="btnDiv">
       <button class="col-2 k-button k-primary btn-popup mr-10" type="submit" tabindex="0">Generate</button>
                     <button class="col-2 k-button k-primary btn-popup" type="button" tabindex="0" @click="resetForm">Reset</button>
                                                </div>
            </form>
            <!-- <div v-if="reportGenerationData.length > 0">
                <div class="row">
            <button @click="exportToExcel" class="k-button btn-popup" style="margin: 5px 5px 5px 14px;"><i class="fa fa-file-excel"></i>Export Excel</button>
            </div>
                 <Grid
                    ref="grid" id="reportGenerationGrid"
                    :resizable="true"
                    :style="{ height: '37vh' }"
                    :auto-bind="false"
                    :data-items="result"
                    :no-records="true"
                    :pageable="true"
                    :total="gridDataTotal"
                    :page-size="pageSize"
                    :skip="skip"
                    :take="take"
                     @pagechange="pageChangeHandler"
                    :columns="columns">
        </Grid>
        </div> -->
        </div>
         <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
         <filter-popup v-if="filterData" :dataItems="filterData" @cancel="cancelFilterPopup" @saveFilters="saveFilters"></filter-popup>
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
import FilterPopup from "../ReportGeneration/FiltersPopup.vue";
import { Grid } from "@progress/kendo-vue-grid";

export default({
    name:"generateReportData", 
    components: {
    "k-input": Input,
     dropdownlist: DropDownList, 
     "error-popup":ErrorPopup,
     "message-popup":MessagePopup,
     "filter-popup": FilterPopup,
     Grid: Grid,
  },
    data() {
      return {
     base_url: this.$config.reportApiUrl,
       base_url_management:this.$config.reportApiManagementUrl,
        reportGenerationChannelKeys:[],
        errors: [],
        filterData: undefined,
        filterList: [],
        ddlDefault: {
        id: "",
        key: "Select",
        name:"Select"
        },
       skip:0,
        take:10,
        pageSize:10,
        gridDataTotal: 0,
        messageModel:undefined,
        reportGenerationData: [],
        columns: [],
      generateReportModel: {
          channelKey: {
                        id:"",
                        key:"Select"
                        },
          entityName: "",
      }
    };
    },
     computed: {
       result: {
            get: function() {
                return this.reportGenerationData.slice(this.skip, this.take + this.skip);
            }
        }
    },
    beforeMount: function(){
        this.getReportGenerationChannelKeys();
    },
    methods:{
        pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
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
        if(this.generateReportModel.channelKey && this.generateReportModel.channelKey.key && this.generateReportModel.channelKey.key == "Select"){
            this.generateReportModel.channelKey = undefined
        }
        if(this.generateReportModel.channelKey && this.generateReportModel.entityName){
            //this.generateReportData();
            this.exportToExcel();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.generateReportModel.channelKey) {
        this.errors.push('Please select a Channel Key.');
      }
      if (!this.generateReportModel.entityName || $.trim(this.generateReportModel.entityName) == "") {
        this.errors.push('Please enter a Collection Name.');
      }

      e.preventDefault();
    },
    async generateReportData(){
        let data = {
            entityName : this.generateReportModel.entityName,
            Channelkey: this.generateReportModel.channelKey.key,
            filters: this.filterList
        }
        await axios.post(this.base_url_management + "getReportData",data).then((response) => {
        if(response.data.status){
            //this.resetForm();
            if(response.data.result.length > 0){
            this.reportGenerationData = response.data.result;
            }else{
                this.reportGenerationData = [];
                response.data.status = false;
                this.messageModel = response.data;
            }
        }else{
            this.messageModel = response.data;
            this.reportGenerationData = [];
        }
        this.gridDataTotal =this.reportGenerationData.length;
        console.log(response);
      })
    },
    onChangeChannelKey(event) {
        this.generateReportModel.channelKey = event.target.value;
    },
    resetForm(){
        this.generateReportModel= {
          channelKey: {
                        id:"",
                        key:"Select"
                        },
          entityName: ""
      };
      this.filterList = [];
      this.reportGenerationData = [];
    },    
    errorPopupOk(){
      this.errors = [];
    },
    messagePopupOk(){
        this.messageModel = undefined;
    },
     cancelFilterPopup(){
         this.filterData=undefined;
     },
     openFilterPopup(){
         this.filterData = this.filterList;
     },
      saveFilters(data){
        this.filterList = data;
        this.filterData = undefined;
    },
    async exportToExcel(){
         let dataToPost = {
            entityName : this.generateReportModel.entityName,
            Channelkey: this.generateReportModel.channelKey.key,
            filters: this.filterList
        }
        await axios({
            url:this.base_url_management + "GenerateReportDataExcelFile",
            method: 'POST',
            responseType: 'blob', // important
            data: dataToPost // data to post to server
            }).then(response => {
            let headers = response.headers;
            let blob = new Blob([response.data], { type: headers["content-type"] });
            let link = document.createElement('a');
            let formattedDateTime = this.getFormattedDateTime();
            link.href = window.URL.createObjectURL(blob);
            link.download = "ReportData_"+ formattedDateTime.toString();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            link = null;
        })
    },
    getFormattedDateTime() {
    let today = new Date();
    let y = today.getFullYear();
    // JavaScript months are 0-based.
    let m = today.getMonth() + 1 >= 10 ? today.getMonth() + 1: "0"+(today.getMonth() + 1).toString();
    let d = today.getDate() >= 10 ? today.getDate(): "0"+today.getDate();
    let h = today.getHours();
    let mi = today.getMinutes();
    let s = today.getSeconds();
    let formattedDate = y + m + d + h + mi + s;
    return formattedDate.toString();
    }
    },
   
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