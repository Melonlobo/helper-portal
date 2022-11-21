<template>
    <div class="emailHistories">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Email Histories</h2>
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
                          :data-items="emailChannelKeys"      
                           :default-item="ddlDefault"   
                      :text-field="'key'"
                          :data-item-id="'id'"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                  </td>
                  <td><label>Tag</label></td>
                  <td><input type="text" v-model="tag"></td>
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
        ref="grid" id="emailHistoriesGrid"
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
    name: "EmailHistories",
    components: {
         Grid: Grid,
        dropdownlist: DropDownList,
        "error-popup":ErrorPopup,
        "message-popup":MessagePopup
    },
    beforeMount: function(){
        this.getEmailChannelKeys();
    },
    mounted:function(){
    },
    data() {
      return {
      base_url: this.$config.emailApiUrl,
       base_url_management:this.$config.emailApiManagementUrl,
      selectedChannelKey: undefined,
        tag: undefined,
        messageModel: undefined,
        gridDataTotal: 0,
        skip:0,
        take:10,
        pageSize:10,
      errors: [],
      emailHistories: [],
      emailChannelKeys: [],
      columns: [
        {
          field: "sender",
          editable: false,
          title: "Sender"
        },{
          field: "recipients",
          editable: false,
          title: "Recipients"
        },{
          field: "sentOn",
          editable: false,
          title: "Sent On"
        },
        {
          field: "templateName",
          editable: false,
          title: "Template Name"
        },
        {
          field: "templateVariant",
          editable: false,
          title: "Template Variant"
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
                return this.emailHistories.slice(this.skip, this.take + this.skip);
            }
        }
    },
    methods:{
       pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
        async getEmailHistories() {
      console.log( this.base_url + "getEmailHistories/")
      if(!this.tag){
        this.tag = "";
      }
      try {
        axios.get(
          this.base_url_management + "getEmailHistories/"+this.selectedChannelKey.id+"/"+ this.tag).then((response) => {  
              if(response.data.result != null){
              this.emailHistories=response.data.result;
              }
              else{
                  this.emailHistories = []
              }
              this.gridDataTotal =this.emailHistories.length;
        });
      } catch (err) {
       this.messageModel = err.response.data;
      }
    },
        async getEmailChannelKeys(){
try{
        const response = await axios.get(this.base_url_management + "GetEmailChannelKeys");
        this.emailChannelKeys = response.data.result;
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
            this.getEmailHistories();
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
                data: this.emailHistories,
                fileName: "EmailHistories",
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
