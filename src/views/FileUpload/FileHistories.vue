<template>
    <div class="fileHistories">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">File Histories</h2>
            </div>
           <form class="panel-heading p-0" @submit.prevent="validateForm">
            <div class="table-responsive">
              <table class="table mb-0 text-left sm-font">
                <tr>
                  <td>
                      <label>Channel Key<span class="c-danger">*</span></label>
                  </td>
                  <td> 
                        <dropdownlist
                         :style="{'font-size': '12px'}"
                          :data-items="fileChannelKeys"      
                           :default-item="ddlDefault"   
                      :text-field="'key'"
                          :data-item-id="'id'"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                  </td>
                   <td><label>Reference ID</label></td>
                  <td><input type="text" v-model="referenceID" ></td>
                   <td><label>Reference Type</label></td>
                  <td><input type="text" v-model="referenceType" ></td>                 
                </tr>
                <tr>
                   <td><label>Tag</label></td>
                  <td><input type="text" class="align-input" v-model="tag" ></td>
                  <td>
                    <button
            type="submit"
            value="Search"
  class="k-button k-secondary mr-4"
          
          >
            <i class="fa fa-search" aria-hidden="true"></i> Search
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
        ref="grid" id="fileHistoriesGrid"
        :style="{ height: '53vh' }"
        :auto-bind="false"
        :data-items="result"
        :no-records="true"
        :pageable="true"
        :total="gridDataTotal"
         :resizable="true"
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
    name: "FileHistories",
    components: {
         Grid: Grid,
        dropdownlist: DropDownList,
        "error-popup":ErrorPopup,
        "message-popup":MessagePopup 
    },
    beforeMount: function(){
        this.getFileChannelKeys();
    },
    mounted:function(){
    },
    data() {
      return {
     base_url: this.$config.fileApiUrl,
       base_url_management:this.$config.fileApiManagementUrl,
      selectedChannelKey: undefined,
      messageModel: undefined,
        tag: undefined,
           skip:0,
        take:10,
        pageSize:10,
        gridDataTotal:0,
        referenceID: undefined,
        referenceType: undefined,
      errors: [],
      fileHistories: [],
      fileChannelKeys: [],
      columns: [
        {
          field: "fileName",
          editable: false,
          title: "File Name"
        },{
          field: "fileType",
          editable: false,
          title: "File Type"
        },{
          field: "fileUrl",
          editable: false,
          title: "FileUrl"
        },
        {
          field: "uploadedOn",
          editable: false,
          title: "Uploaded On"
        },{
          field: "channelKey",
          editable: false,
          title: "Channel Key"
        },{
          field: "providerName",
          editable: false,
          title: "Provider Name"
        },
        {
          field: "referenceID",
          editable: false,
          title: "Reference ID"
        },
        {
          field: "referenceType",
          editable: false,
          title: "Reference Type"
        },
        {
          field: "tags",
          editable: false,
          title: "Tag"
        },
        {
          field: "status",
          editable: false,
          title: "Status"
        },
        {
          field: "attempts",
          editable: false,
          title: "Attempts"
        },
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
                return this.fileHistories.slice(this.skip, this.take + this.skip);
            }
        }
    },
    methods:{
         pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
        async getFileHistories() {
      this.tag = this.tag ? this.tag : "";
      this.referenceID = this.referenceID ? this.referenceID : "";
      this.referenceType = this.referenceType ? this.referenceType : "";
      try {
        axios.get(
          this.base_url_management + "GetFileUploadHistories?channelID="+this.selectedChannelKey.id+"&referenceID="+this.referenceID+"&referenceType="+this.referenceType+"&tag="+ this.tag).then((response) => {  
              if(response.data.result != null){
              this.fileHistories=response.data.result;
              }
              else{
                  this.fileHistories = []
              }
              this.gridDataTotal =this.fileHistories.length;
        });
      } catch (err) {
         this.messageModel = err.response.data;
      }
    },
        async getFileChannelKeys(){
try{
        const response = await axios.get(this.base_url_management + "GetFileChannelKeys");
        this.fileChannelKeys = response.data.result;
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
        if(this.selectedChannelKey){
            this.getFileHistories();
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
                data: this.fileHistories,
                fileName: "FileHistories",
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

.align-input{
  width: 150px;
}

.cell-btn{
  position: absolute;
  margin-left: -52px;
}

/* table {
    border-collapse: separate;
    border-spacing: 0.5em 0.5em;
} */
</style>
