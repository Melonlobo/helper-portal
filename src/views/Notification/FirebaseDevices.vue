<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Firebase Devices</h2>
            </div>
            <div>
                 <form class="panel-heading p-0" @submit.prevent="validateForm">
              <table class="table mb-0 sm-font text-left">
                <tr>
                  <td class="custom-table-cell">
                      <label>Channel Key<span class="c-danger">*</span></label>
                  </td>
                  <td> 
                        <dropdownlist
                        :style="{'font-size': '12px'}"
                          :data-items="channelKeys"      
                           :default-item="ddlDefault"   
                      :text-field="'channelKey'"
                          :data-item-id="'id'"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                  </td>
                  <td class="custom-table-cell">
                    <button
            type="submit"
            value="Search"
  class="k-button k-secondary mr-4"
          
          >
            <i class="fa fa-search" aria-hidden="true"></i> Search
          </button>
                  </td>
                  <td class="btn-add-email-template">
                      <button type="button" class="k-button k-secondary" @click="insert"><i class="fa fa-plus"></i>Add new</button>

                  </td>
                </tr>
              </table>
    </form>
                <Grid ref="grid" :data-items="result"
                :style="{ height: '60vh' }" 
                 :columns="columns"
                  :resizable="true"
                 :pageable="true"
                 :total="gridDataTotal"
                   :page-size="pageSize"
                  :skip="skip"
                  :take="take"
                  @pagechange="pageChangeHandler"
                >
                   <template v-slot:customCommandTemplate="{props}">
                        <custom-command-cell :data-item="props.dataItem" 
                        @edit="edit"
                        @remove="confirmDeletePopup"/>
                    </template>
                </Grid>
                <dialog-container v-if="firebaseDeviceModel" :dialog-title="dialogTitle" :data-item="firebaseDeviceModel" :channelKeys="channelKeys" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteFirebaseDevice" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditFirebaseDevice.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "FirebaseDevices",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         dropdownlist: DropDownList, 
         "custom-command-cell": CommandCell,
         "error-popup":ErrorPopup,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup      
    },
    data() {
      return {
      base_url: this.$config.notificationApiUrl,
       base_url_management:this.$config.notificationApiManagementUrl,
        firebaseDevices:[],
        selectedChannelKey: undefined,
        channelKeys: [],
        gridDataTotal:0,
            skip:0,
        take:10,
        pageSize:10,
        messageModel: undefined,
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "referenceID1",
          editable: false,
          title: "Reference ID 1",
          //type: "text",
          //width: "150px" 
        },
        {
         field: "referenceID2",
          editable: false,
          title: "Reference ID 2",
          //type: "text",
          //width: "150px" 
        },{
          field: "registrationToken",
          editable: false,
          title: "Registration Token",
          //type: "text",
          //width: "150px" 
        }, 
        {
          field: "platform",
          editable: false,
          title: "Platform",
          //type: "text",
          //width: "150px" 
        }, 
        {
          field: "modifiedDate",
          editable: false,
          title: "Modified Date",
          //type: "text",
          //width: "150px" 
        },        
        {
          field: "channelKey",
          editable: false,
          title: "Channel Key",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate",title: "Action" },
      ],
      firebaseDeviceModel: undefined,
      deleteModel: undefined,
      errors:[],
      ddlDefault: {
        id: "",
        channelKey: "Select",
      },
    };
    },
    beforeMount: function() {
        this.getChannelKeys()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
        result: {
            get: function() {
                return this.firebaseDevices.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.firebaseDeviceModel.id === undefined ? "Add" : "Edit"} Firebase Device`;
        }
    },
    methods: {
       pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
    async getChannelKeys(){
try{
 
        const response = await axios.get(this.base_url_management + "GetChannelKeys");
         debugger
        this.channelKeys = response.data.result;
        }catch(err){
            this.messageModel = err.response.data;
        }
    },
    async getFirebaseDevices(){
        console.log("getFirebaseDevices");
        try{
        const response = await axios.get(this.base_url_management + "GetFirebaseDevicesByChannel/"+this.selectedChannelKey.id);
        if(response.data.status){
        this.firebaseDevices = response.data.result;
        }else{
          this.firebaseDevices = [];
        }
        this.gridDataTotal =this.firebaseDevices.length;
        }catch(err){
            this.messageModel = err.response.data;
        }
    },
    async registerFirebaseDevice(dataItem){
        console.log("registerFirebaseDevice");
        try{
        let data = {
            referenceID1: dataItem.referenceID1,
            referenceID2: dataItem.referenceID2,
            registrationToken: dataItem.registrationToken,
            platform: dataItem.platform,
            channelID: dataItem.channelID
        }
        await axios.post(this.base_url_management + "registerFirebaseDevice",data).then((response) => {
        //e.success(response.data.status);
        this.getFirebaseDevices();
        console.log(response);
      })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateFirebaseDevice(dataItem){
        console.log("updateFirebaseDevice");
        try{
            let data = {
                id: dataItem.id,
            referenceID1: dataItem.referenceID1,
            referenceID2: dataItem.referenceID2,
            registrationToken: dataItem.registrationToken,
            platform: dataItem.platform,
            channelID: dataItem.channelID
        }
        await axios.post(this.base_url_management + "UpdateFirebaseDevice",data).then((response) => {
        //e.success(response.data.status);
       this.getFirebaseDevices();
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
     async deleteFirebaseDevice(dataItem){
        console.log("deleteFirebaseDevice");
        try{
        await axios.delete(this.base_url_management + "RemoveFirebaseDevice/"+dataItem.registrationToken).then((response) => {
        //e.success(response.data.status);
       this.getFirebaseDevices();
        console.log(response);
      })
        }catch(err){
       this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.firebaseDeviceModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.firebaseDeviceModel;
      const isNewDevice = dataItem.id == undefined;
      if (!isNewDevice) {
        this.updateFirebaseDevice(dataItem);
      } else {
        this.registerFirebaseDevice(dataItem);
      }
      this.firebaseDeviceModel = undefined;
    },
    cancelPopup() {
      this.firebaseDeviceModel = undefined;
    },
    insert() {
      this.firebaseDeviceModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
     onChangeChannelKey(event){
         this.selectedChannelKey = event.target.value;        
    },
    validateForm(e){
        if(this.selectedChannelKey != undefined && this.selectedChannelKey.channelKey == "Select"){
            this.selectedChannelKey = undefined
        }
        if(this.selectedChannelKey){
            this.getFirebaseDevices();
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
    confirmDeletePopup(dataItem){
      this.deleteModel = this.cloneProduct(dataItem);
    },
    cancelConfirmation(){
      this.deleteModel = undefined;
    },
    messagePopupOk(){
        this.messageModel = undefined;
    }
    }
})
</script>
<style scoped>
.btn-add-email-template{
  text-align: right;
  width: 905px
}

.custom-table-cell{
width: 145px;
padding-right: 10px;
}

p{
  margin-bottom: 0px!important;
}
</style>
