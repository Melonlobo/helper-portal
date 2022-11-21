<template>
    <div class="reportGenerationHistories">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Report Histories</h2>
            </div>
           <form class="panel-heading p-0" @submit.prevent="validateForm">
            <div class="table-responsive">
              <table class="table mb-0 sm-font text-left">
                <colgroup>
                  <col span="1" style="width: 60px" />
                  <col span="1" style="width: 100px" />
                  <col span="1" style="width: 38px" />
                  <col span="1" style="width: 100px" />
                  <col span="1" style="width: 100px" />
                  </colgroup>
                  <tr>
                  <td>
                      <label>Channel Key<span class="c-danger">*</span></label>
                  </td>
                  <td> 
                        <dropdownlist
                        :style="{'font-size': '12px'}"
                          :data-items="reportGenerationChannelKeys"      
                           :default-item="ddlDefault"   
                      :text-field="'key'"
                          :data-item-id="'id'"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                  </td>
                  <td><label>Table name</label></td>
                  <td><input type="text" v-model="collectionName"></td>
                  <td>
                    <button
                      type="submit"
                      value="Search"
                      class="k-button k-secondary mr-4"
                    >
                      <i class="fa fa-search" aria-hidden="true"></i> Search
                    </button>
                    <button @click="exportExcel" class="k-button"><i class="fa fa-file-excel"></i>Export Excel</button>
                  </td>
                  
                </tr>
              </table>
            </div>
    </form>
        <div>
            <Grid
        ref="grid" id="reportGenerationHistoriesGrid"
         :resizable="true"
        :style="{ height: '60vh' }"
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
        </div>
        </div>
        <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
        <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
    </div>
</template>
<script>
import { Grid } from "@progress/kendo-vue-grid";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import axios from "axios";
import ErrorPopup from "../shared/ErrorPopup.vue";
import { saveExcel } from '@progress/kendo-vue-excel-export';
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "ReportGenerationHistories",
    components: {
         Grid: Grid,
        dropdownlist: DropDownList,
        "error-popup":ErrorPopup,
        "message-popup":MessagePopup
    },
    beforeMount: function(){
        this.getReportGenerationChannelKeys();
    },
    mounted:function(){
    },
    data() {
      return {
      base_url: this.$config.reportApiUrl,
       base_url_management:this.$config.reportApiManagementUrl,
      selectedChannelKey: undefined,
        collectionName: undefined,
        messageModel: undefined,
        gridDataTotal: 0,
        skip:0,
        take:10,
        pageSize:10,
      errors: [],
      reportGenerationHistories: [],
      reportGenerationChannelKeys: [],
      columns: [
        {
          field: "channelKey",
          editable: false,
          title: "Channel Key"
        },{
          field: "retrievedRecordCount",
          editable: false,
          title: "Retrieved Record Count"
        },
        {
          field: "tableName",
          editable: false,
          title: "TableName"
        },
        {
          field: "generatedOn",
          editable: false,
          title: "GeneratedOn"
        },
        {
          field: "status",
          editable: false,
          title: "Status"
        }        
      ],
      ddlDefault: {
        id: "",
        key: "Select",
      },
    };
    },
     computed: {
       result: {
            get: function() {
                return this.reportGenerationHistories.slice(this.skip, this.take + this.skip);
            }
        }
    },
    methods:{
       pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
        async getReportGenerationHistories() {
      console.log( this.base_url + "getHistories/")
      if(!this.tag){
        this.tag = "";
      }
      try {
        axios.get(
          this.base_url_management + "getHistories/"+this.selectedChannelKey.id+"/"+ this.collectionName).then((response) => {  
              if(response.data.result != null){
              this.reportGenerationHistories=response.data.result;
              }
              else{
                  this.reportGenerationHistories = []
              }
              this.gridDataTotal =this.reportGenerationHistories.length;
        });
      } catch (err) {
       this.messageModel = err.response.data;
      }
    },
        async getReportGenerationChannelKeys(){
try{
        const response = await axios.get(this.base_url_management + "getChannelKeys");
        this.reportGenerationChannelKeys = response.data.result;
        }catch(err){
           this.messageModel = err.response.data;
        }
    },
    onChangeChannelKey(event) {
      this.selectedChannelKey = event.target.value;
    },
    validateForm(e){
        if(this.selectedChannelKey && this.selectedChannelKey.key == "Select"){
            this.selectedChannelKey = null
        }
        if(!this.collectionName){
          this.collectionName = ""
        }
        if(this.selectedChannelKey){
            this.getReportGenerationHistories();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.selectedChannelKey) {
        this.errors.push('Please select a Channel Key.');
      }

      e.preventDefault();
    },
    errorPopupOk(){
      this.errors = [];
    },
     exportExcel () {
            saveExcel({
                data: this.reportGenerationHistories,
                fileName: "ReportGenerationHistories",
                columns: this.columns
            });
        },
    messagePopupOk(){
        this.messageModel = undefined;
    }
   }
})
</script>
<style scoped>
.custom-table-cell{
width: 145px;
padding-right: 10px;
}

p{
  margin-bottom: 0px!important;
}
</style>
