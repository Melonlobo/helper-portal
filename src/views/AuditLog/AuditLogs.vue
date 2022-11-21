<template>
    <div class="auditEntities">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Audit Reports</h2>
            </div>
            <form class="panel-heading p-0 search-criteria" @submit.prevent="validateForm">
              <div class="table-responsive">
              <table class="table mb-0 text-left"> 
                      <col span="1" style="width: 120px" />
                  <col span="1" style="width: 100px" />
                  <col span="1" style="width: 115px" />
                  <col span="1" style="width: 100px" />
                  <col span="1" style="width: 70px" />
                  <col span="1" style="width: 100px" />
                  <col span="1" style="width: 70px" />
                  <col span="1" style="width: 100px" />
        <tr>
          <td><label>App Key<span class="c-danger">*</span></label></td>
          <td>
            <dropdownlist
            :style="{'font-size': '12px'}"
            :data-items="applicationKeys"
            :default-item="ddlDefault"       
                          :text-field="'key'"
                          :data-item-id="'id'"       
            v-model="applicationKey"
             @change="onChangeApplicationKey"
          >
          </dropdownlist>
          </td>
          <td><label>Entity Name<span class="c-danger">*</span></label></td>
          <td>
             <dropdownlist
             :style="{'font-size': '12px'}"
            :data-items="entityNames"
            :default-item="ddlDefault"
            :text-field="'entityName'"
                          :data-item-id="'id'" 
            v-model="entityName"
            @change="onChangeEntityName"
          >
          </dropdownlist>
          </td>
          <td ><label>Ref ID</label></td>
          <td ><input type="text" class="align-input" v-model="referenceID" ></td>
           <td><label>Property</label></td>
          <td><input type="text" class="align-input" v-model="property" ></td>          
        </tr>
        <tr>
           <td><label>From</label></td>
          <td><datepicker  :style="{'font-size': '12px'}" :default-Show="true" v-model="fromDate" :format="'MM/dd/yyyy'"
                        :format-placeholder="'formatPattern'">
                    </datepicker></td>
           <td><label>To</label></td>
          <td><datepicker  :style="{'font-size': '12px'}" :default-Show="true" v-model="toDate" :format="'MM/dd/yyyy'"
                        :format-placeholder="'formatPattern'">
                    </datepicker></td>
                    <td>
            <button
            type="submit"
            value="Search"
            class="k-button k-secondary"
          >
            <i class="fa fa-search"></i>Search
          </button>
          </td>
          <td>
            
          <button @click="exportExcel" class="k-button"><i class="fa fa-file-excel"></i>Export Excel</button>
          </td>
        </tr>
      </table>
      </div>
    </form>
        <div>
            <Grid
        ref="grid" id="auditLogsGrid"
        :style="{ height: '53vh' }"
        :data-items="result"
        :no-records="true"
        :total="gridDataTotal"
        :pageable="true"
         :page-size="pageSize"
          :skip="skip"
          :take="take"
          @pagechange="pageChangeHandler"
         :resizable="true"
        :columns="columns">
        </Grid>
        </div>
        </div>
        <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
        <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
    </div>
    
</template>
<script>
import { Grid } from "@progress/kendo-vue-grid";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import axios from "axios";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import { saveExcel } from '@progress/kendo-vue-excel-export';
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "AuditLogs",
    components: {
         Grid: Grid,
        dropdownlist: DropDownList,
        "error-popup":ErrorPopup,
        "datepicker": DatePicker,
         "message-popup":MessagePopup
    },
    beforeMount: function(){
        this.getApplicationKeys();
    },
    mounted:function(){
      // fix position of placeholder in kendo datepicker
      $(".k-dateinput-wrap").children().attr("style","padding-top: 0px;");
    },
    computed: {
        result: {
            get: function() {
                return this.auditLogs.slice(this.skip, this.take + this.skip);
            }
        }
    },
    data() {
      return {
       base_url: this.$config.auditLogApiUrl,
       base_url_management:this.$config.auditLogApiManagementUrl,
         skip:0,
        take:10,
        pageSize:10,
       fromDate: undefined,
       messageModel: undefined,
       toDate: undefined,
       gridDataTotal:0,
      tempAppKey: undefined,
      tempEntityName: undefined,
        applicationKey: undefined,
        entityName: undefined,
        referenceID: undefined,
        property: undefined,
      errors: [],
      auditLogs: [],
      applicationKeys: [],
      entityNames: [],
      property: undefined,
      referenceID: undefined,
      columns: [
        {
          field: "performedByName",
          editable: false,
          title: "Performed By"
        },{
          field: "performedOn",
          editable: false,
          title: "Performed On"
        },{
          field: "actionType",
          editable: false,
          title: "Action Type"
        },
        {
          field: "action",
          editable: false,
          title: "Action"
        },
        {
           field: "entityName",
          editable: false,
          title: "Entity Name"
        },
        {
           field: "referenceID",
          editable: false,
          title: "Reference ID"
        },
        {
           field: "applicationKey",
          editable: false,
          title: "Application Key"
        }
      ],
      ddlDefault: {
        id: "",
        key: "Select",
        entityName: "Select",
      },
    };
    },
    methods:{
        pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
      exportExcel () {
            saveExcel({
                data: this.auditLogs,
                fileName: "AuditReport",
                columns: this.columns
            });
        },
        async getAuditLogs() {
      try {
        var fromDateDay,fromDateMonth,fromDateYear,toDateDay,toDateMonth,toDateYear;
        if(this.fromDate){
          fromDateDay = this.fromDate.getDate();
          fromDateMonth = this.fromDate.getMonth() + 1;
          fromDateYear = this.fromDate.getFullYear();
        }
        if(this.toDate){
           toDateDay = this.toDate.getDate();
          toDateMonth = this.toDate.getMonth() + 1;
          toDateYear = this.toDate.getFullYear();
        }
        if($.trim(this.property) == ""){
          this.property = "";
        }
        if($.trim(this.referenceID) == ""){
          this.referenceID = "";
        }
        let data = {
            applicationID : this.applicationKey.id,
            entityID : this.entityName.id,
            property : this.property,
            referenceID: this.referenceID,
            fromDateDay: fromDateDay,
            fromDateMonth: fromDateMonth,
            fromDateYear: fromDateYear,
            toDateDay:toDateDay,
            toDateMonth:toDateMonth,
            toDateYear:toDateYear
        }
        axios.post(
          this.base_url_management + "GetAuditLog", data).then((response) => {  
              if(response.data.result != null){
              this.auditLogs=response.data.result;
              
              }
              else{
                  this.auditLogs = []
              }
              this.gridDataTotal =this.auditLogs.length;
              // if(this.auditLogs.length > 0){
              //   this.auditLogs = this.auditLogs.slice(this.skip,this.take);
              // }
        });
      } catch (err) {
        this.messageModel = err.response.data;
      }
    },
        async getApplicationKeys() {
      try {
        await axios.get(
          this.base_url_management + "GetApplicationKeys").then((response) => {
                      this.applicationKeys=response.data.result;
        console.log(response.data.result);
        });
      } catch (err) {
        this.messageModel = err.response.data;
      }
    },
    onChangeApplicationKey(event) {
      console.log("change", event.target.value);
      this.tempAppKey = event.target.value;
       try {
           if(this.tempAppKey && this.tempAppKey.key != "Select"){
        axios.get(
          this.base_url_management + "GetEntityNames/"+this.tempAppKey.id).then((response) => { 
              if(response.data.result != null && response.data.result.length > 0){ 
              this.entityNames =response.data.result;
              }else{
                  this.entityNames = [];
              }
              this.entityName = null;
        console.log(response.data.result);
        });
           }
           else{
               this.entityNames = [];
               this.entityName = null;
           }
      } catch (err) {
        this.messageModel = err.response.data;
      }
    },
    onChangeEntityName(event){
         console.log("change", event.target.value);
      this.tempEntityName = event.target.value;
    },
    validateForm(e){
      var isDateValid = true;
        if(this.applicationKey && this.applicationKey.key == "Select"){
            this.applicationKey = undefined
        }
        if(this.entityName && this.entityName.entityName == "Select"){
            this.entityName = undefined
        }         
        this.errors = [];
        if(this.fromDate && this.toDate){
          isDateValid = this.checkDateRange(this.fromDate,this.toDate);
          
        }else{
          if(this.fromDate){
            if(!Date.parse(this.fromDate)){
                this.errors.push("Invalid From Date")
                isDateValid = false;
            }
          }
          else if(this.toDate){
            if(!this.fromDate){
               this.errors.push("From Date is required if To Date has value")
               isDateValid = false;
            }
          }
        }
       if(this.applicationKey && this.entityName && isDateValid){
            this.getAuditLogs();
            this.errors = [];
            return true;
        }
        
      if (!this.applicationKey) {
        this.errors.push('Please select an Application Key.');
      }
       if (!this.entityName) {
        this.errors.push('Please select an Entity Name.');
      }

      e.preventDefault();
    },
    errorPopupOk(){
      this.errors = [];
    },
    checkDateRange(start, end) {
   // Parse the entries
   var startDate = Date.parse(start);
   var endDate = Date.parse(end);
   // Make sure they are valid
    if (isNaN(startDate)) {
      this.errors.push("The From date provided is not valid, please enter a valid date.");
      return false;
   }
   if (isNaN(endDate)) {
       this.errors.push("The To date provided is not valid, please enter a valid date.");
       return false;
   }
   // Check the date range, 86400000 is the number of milliseconds in one day
   var difference = (endDate - startDate) / (86400000 * 7);
   if (difference < 0) {
       this.errors.push("The To Date must be greater than the From Date.");
       return false;
   }
  //  if (difference <= 1) {
  //      alert("The range must be at least seven days apart.");
  //      return false;
  //   }
   return true;
},
 messagePopupOk(){
        this.messageModel = undefined;
    }
   }
})
</script>
<style scoped>
td{
  border: 0;
  padding: 0.5rem;
}
.input-margin{
  margin: 0px 5px 0px 5px;
}

.label-margin{
  margin-left: 5px;
}

p {
    margin-bottom: 0!important;
}
.w-145{
  width: 145px;
}
.cell-btn{
  position: absolute;
  margin-left: -33px;
}
.w-88{
  width: 88px;
}
.align-input{
  width: 150px;
}

.k-datepicker {
    height: 30px;
    margin: 0 3px;
}

.search-criteria{
  font-size: 14px;
}
</style>