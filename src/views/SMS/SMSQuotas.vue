<template>
    <div class="smsHistories">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">SMS Quotas</h2>
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
                          :data-items="smsChannelKeys"      
                           :default-item="ddlDefault"   
                      :text-field="'key'"
                          :data-item-id="'id'"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                  </td>
                  <!-- <td><label>Tag</label></td>
                  <td><input type="text" v-model="tag"></td> -->
                  <td>
                    <button
                      type="submit"
                      value="Search"
                      class="k-button k-secondary mr-4"
                    >
                      <i class="fa fa-search" aria-hidden="true"></i> Search
                    </button>
                    <!-- <button @click="exportExcel" class="k-button"><i class="fa fa-file-excel"></i>Export Excel</button> -->
                  </td>
                   <td class="btn-add-sms-channel">
                      <button type="button" class="k-button k-secondary" @click="insert"><i class="fa fa-plus"></i>Add new</button>

                  </td>
                </tr>
              </table>
            </div>
    </form>
        <div>
            <Grid
        ref="grid" id="smsQuotasGrid"
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
         <template v-slot:customCommandTemplate="{props}">
                        <custom-command-cell :data-item="props.dataItem" 
                        @edit="edit"
                        @remove="confirmDeletePopup"/>
                    </template>
        </Grid>
        </div>
        </div>
        <dialog-container v-if="smsQuotaModel" :dialog-title="dialogTitle" :data-item="smsQuotaModel" :smsChannelKeys="smsChannelKeys" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
        <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
        <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteSMSQuota" @cancel="cancelConfirmation"></confirmation-popup>
        <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
    </div>
</template>
<script>
import { Grid } from "@progress/kendo-vue-grid";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import axios from "axios";
import ErrorPopup from "../shared/ErrorPopup.vue";
import MessagePopup from "../shared/MessagePopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue";
import DialogContainer from "./AddEditSMSQuota.vue";
import CommandCell from "../shared/CommandCell.vue";

export default ({
    name: "SMSQuotas",
    components: {
         Grid: Grid,
        dropdownlist: DropDownList,
        "error-popup":ErrorPopup,
        "message-popup":MessagePopup,
        "dialog-container": DialogContainer,
        "confirmation-popup": ConfirmationPopup,
        "custom-command-cell": CommandCell,
    },
    beforeMount: function(){
        this.getSMSChannelKeys();
    },
    mounted:function(){
    },
    data() {
      return {
      base_url: this.$config.smsApiUrl,
       base_url_management:this.$config.smsApiManagementUrl,
      selectedChannelKey: undefined,
        tag: undefined,
        messageModel: undefined,
        gridDataTotal: 0,
        skip:0,
        take:10,
        pageSize:10,
      errors: [],
      smsQuotas: [],
      smsChannelKeys: [],
      deleteModel: undefined,
      smsQuotaModel:undefined,
      columns: [
        {
          field: "smsChannelID",
          editable: false,
          title: "Channel ID",
          hidden: true
        },
        {
          field: "smsChannelKey",
          editable: false,
          title: "Channel Key"
        },
        {
          field: "currentMonth",
          editable: false,
          title: "Current Month"
        },
        {
          field: "monthlyConsumption",
          editable: false,
          title: "Monthly Consumption"
        },{
          field: "monthlyQuota",
          editable: false,
          title: "Monthly Quota"
        },
        {
          field: "totalConsumption",
          editable: false,
          title: "Total Consumption"
        },
        {
          field: "totalQuota",
          editable: false,
          title: "Total Quota"
        },
        { cell: "customCommandTemplate" }
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
                return this.smsQuotas.slice(this.skip, this.take + this.skip);
            }
        },
         dialogTitle() {
      return `${this.smsQuotaModel.id === undefined ? "Add" : "Edit"} SMS Quota`;
        }
    },
    methods:{
       pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
        async getSMSQuotas() {
      console.log( this.base_url + "getSMSQuotas/")
      if(!this.tag){
        this.tag = "";
      }
      try {
        axios.get(
          this.base_url_management + "getSMSQuotaList/"+this.selectedChannelKey.id+"/"+ this.tag).then((response) => {  
              if(response.data.result != null){
              this.smsQuotas=response.data.result;
              }
              else{
                  this.smsQuotas = []
              }
              this.gridDataTotal =this.smsQuotas.length;
        });
      } catch (err) {
       this.messageModel = err.response.data;
      }
    },
        async getSMSChannelKeys(){
try{
        const response = await axios.get(this.base_url_management + "GetSMSChannelKeys");
        this.smsChannelKeys = response.data.result;
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
            this.getSMSQuotas();
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
    messagePopupOk(){
        this.messageModel = undefined;
    },
     confirmDeletePopup(dataItem){
      this.deleteModel = this.cloneProduct(dataItem);
    },
    cancelConfirmation(){
      this.deleteModel = undefined;
    },
    async registerSMSQuota(dataItem){
        console.log("registerSMSQuota");
        try{
        let data = {
            key : dataItem.key,
            monthlyQuota : parseInt(dataItem.monthlyQuota),
                totalQuota: parseInt(dataItem.totalQuota),
            isRestrictedByQuota: true
        }
        await axios.post(this.base_url_management + "addSMSQuota",data).then((response) => {
        if(this.selectedChannelKey != undefined){
        this.getSMSQuotas();
        }
        console.log(response);
      })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateSMSQuota(dataItem){
        console.log("updateSMSQuota");
        try{
            let data = {
                //id: dataItem.id,
                key : dataItem.smsChannelKey,
                monthlyQuota : parseInt(dataItem.monthlyQuota),
                totalQuota: parseInt(dataItem.totalQuota),
                isRestrictedByQuota: true
            }
        await axios.post(this.base_url_management + "updateSMSQuota",data).then((response) => {
          if(this.selectedChannelKey != undefined){
            this.getSMSQuotas();
            }
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
     async deleteSMSQuota(dataItem){
        console.log("deleteSMSQuota");
        try{
        await axios.delete(this.base_url_management + "deleteSMSQuota/"+dataItem.smsChannelID).then((response) => {
       if(this.selectedChannelKey != undefined){
        this.getSMSQuotas();
        }
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.smsQuotaModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.smsQuotaModel;
      const isNewSMSQuota = dataItem.id == undefined;
      if (!isNewSMSQuota) {
        this.updateSMSQuota(dataItem);
      } else {
        this.registerSMSQuota(dataItem);
      }
      this.smsQuotaModel = undefined;
    },
    cancelPopup() {
      this.smsQuotaModel = undefined;
    },
    insert() {
      this.smsQuotaModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
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
