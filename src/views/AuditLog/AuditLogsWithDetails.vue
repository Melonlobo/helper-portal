<template>
    <div class="auditEntities">
        <div class="container-fluid">
            <form class="needs-validation px-2 pt-2" @submit.prevent="validateForm">
      <div class="form-group row" :style="{ marginBottom: '1rem' }">
        <label class="col-sm-2">Select Application Key<span class="c-danger">*</span></label>
        <div>
          <dropdownlist
            :data-items="applicationNames"   
            :default-item="'Select'"         
            v-model="applicationKey"
             @change="onChangeApplicationName"
          >
          </dropdownlist>
        </div>
         <label class="col-sm-2">Select Entity Name<span class="c-danger">*</span></label>
        <div>
          <dropdownlist
            :data-items="entityNames"
            :default-item="'Select'"
            v-model="entityName"
            @change="onChangeEntityName"
          >
          </dropdownlist>
        </div>
         <label class="col-sm-2">Reference ID</label>
          <div>
          <input type="text" v-model="referenceID" >
        </div>
      </div>
      <div class="row p-b-10">
        <label class="col-sm-2">Property</label>
          <div>
          <input type="text" v-model="property" >
        </div>
        <div class="col-sm-2 col-sm-1 my-2 my-sm-0">
          <button
            type="submit"
            value="Search"
  class="k-button k-secondary mr-4"
          
          >
            <i class="fa fa-search"></i> Search
          </button>
        </div>
      </div>
      <div class="row c-danger">
          <p v-if="errors.length > 0">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="(error,index) in errors" :key="index">{{ error }}</li>
            </ul>
          </p>
      </div>
    </form>
        <div>
            <kendo-datasource ref="auditLogDatasource"
                      :data="auditLogsWithDetails"
                      :page-size='5'>
    </kendo-datasource>
            <Grid
        ref="grid" id="auditLogsGrid"
        :style="{ height: '55vh' }"
        :auto-bind="false"
        :data-source-ref="'auditLogDatasource'"
        :no-records="true"
        :pageable="true"
        :columns="columns">
        </Grid>
        </div>
        </div>
    </div>
</template>
<script>
//Page is not used currenty
import { Grid } from "@progress/kendo-grid-vue-wrapper";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { KendoDataSource } from '@progress/kendo-datasource-vue-wrapper';
import axios from "axios";

export default ({
    name: "AuditLogs",
    components: {
         Grid: Grid,
          'kendo-datasource': KendoDataSource,
        dropdownlist: DropDownList,
    },
    beforeMount: function(){
        this.getApplicationNames();
    },
    mounted:function(){
        $(".k-grid-toolbar").addClass("custom-toolbar");
    },
    data() {
      return {
      base_url: "https://localhost:44355/api/auditlog/",
      base_url_management: "https://localhost:44355/api/auditlogmanagement/",
      tempAppKey: undefined,
      tempEntityName: undefined,
    //   selectedAppKey: undefined,
    //   selectedEntityName: undefined,
        applicationKey: undefined,
        entityName: undefined,
        referenceID: undefined,
        property: undefined,
      errors: [],
      auditLogsWithDetails: undefined,
      applicationNames: [],
      entityNames: [],
      property: undefined,
      referenceID: undefined,
      columns: [
        {
          field: "performedByName",
          editable: false,
          title: "Performed By",
          type: "text",
           width: "150px" 
        },{
          field: "performedOn",
          editable: false,
          title: "Performed On",
          type: "text",
          width: "150px" 
        },{
          field: "actionType",
          editable: false,
          title: "Action Type",
          width: "150px",
          type: "text",
        },
        {
          field: "fieldList",
          editable: false,
          title: "Fields",
          type: "text",
          width: "150px"
        },
      ]
    };
    },
    methods:{
        async getAuditLogsWithDetails() {
    //   this.selectedAppKey = this.tempAppKey;
    //   this.selectedEntityName = this.tempEntityName;
    //   if(this.selectedEntityName == undefined){
    //     this.selectedEntityName = ""
    //   }
      console.log( this.base_url + "GetAuditLog/")
      try {
        let data = {
            applicationKey : this.applicationKey,
            entityName : this.entityName,
            property : this.property,
            referenceID: this.referenceID
        }
        console.log("post data");
        console.log(data);
        axios.post(
          this.base_url + "GetAuditLogWithDetails", data).then((response) => {  
              this.auditLogsWithDetails=response.data.result;
        console.log("GetAuditLog res"+this.auditLogsWithDetails[0].action);
        });
      } catch (err) {
        console.log(err);
      }
    },
        async getApplicationNames() {
      try {
        await axios.get(
          this.base_url_management + "GetApplicationKeys").then((response) => {
                      this.applicationNames=response.data.result;
        console.log(response.data.result);
        });
      } catch (err) {
        console.log(err);
      }
    },
    onChangeApplicationName(event) {
      console.log("change", event.target.value);
      this.tempAppKey = event.target.value;
       try {
           if(this.tempAppKey != "Select" && this.tempAppKey != undefined && this.tempAppKey != null){
        axios.get(
          this.base_url_management + "GetEntityNames/"+this.tempAppKey).then((response) => { 
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
        console.log(err);
      }
    },
    onChangeEntityName(event){
         console.log("change", event.target.value);
      this.tempEntityName = event.target.value;
    },
    validateForm(e){
        if(this.applicationKey == "Select"){
            this.applicationKey = null
        }
        if(this.entityName == "Select"){
            this.entityName = null
        }
        if(this.applicationKey && this.entityName){
            this.getAuditLogsWithDetails();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.applicationKey) {
        this.errors.push('Please select an Application Key.');
      }
       if (!this.entityName) {
        this.errors.push('Please select an Entity Name.');
      }

      e.preventDefault();
    }
   }
})
</script>
<style scoped>
.c-danger{
    color:red;
}
</style>
