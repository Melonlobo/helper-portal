<template>
    <div class="auditEntities">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">Notifications</h2>
            </div>
            <form class="panel-heading p-0 search-criteria" @submit.prevent="validateForm">
              <div class="table-responsive">
              <table class="table mb-0 text-left"> 
                      <col span="1" style="width: 120px" />
                  <col span="1" style="width: 100px" />
                  <col span="1" style="width: 115px" />
                  <col span="1" style="width: 100px" />
                  <col span="1" style="width: 70px" />
        <tr>
          <td><label>Channel Key<span class="c-danger">*</span></label></td>
          <td>
            <dropdownlist
            :style="{'font-size': '12px'}"
            :data-items="channelKeys"
            :default-item="ddlDefault"       
                          :text-field="'channelKey'"
                          :data-item-id="'id'"       
            v-model="channelKeyModel"
             @change="onChangeApplicationKey"
          >
          </dropdownlist>
          </td>
          <td ><label>Tags<span class="c-danger">*</span></label></td>
          <td ><input type="text" class="align-input" v-model="tags" placeholder="Comma seperated if multiple" required></td>
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
            
          <!-- <button @click="exportExcel" class="k-button"><i class="fa fa-file-excel"></i>Export Excel</button> -->
          </td>
        </tr>
      </table>
      </div>
    </form>
        <div>
            <Grid
        ref="grid" id="notificationsGrid"
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
                    <template v-slot:customCommandTemplate="{props}">
                        <custom-command-cell :data-item="props.dataItem" 
                        :hideUpdate=true
                        @remove="confirmDeletePopup"/>
                    </template>
        </Grid>
        </div>
        </div>
        <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
        <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteNotification" @cancel="cancelConfirmation"></confirmation-popup>
        <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
    </div>
    
</template>
<script>
import { Grid } from "@progress/kendo-vue-grid";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import axios from "axios";
import MessagePopup from "../shared/MessagePopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue";
import CommandCell from "../shared/CommandCell.vue";

export default ({
    name: "Notifications",
    components: {
         Grid: Grid,
        dropdownlist: DropDownList,
        "error-popup":ErrorPopup,
         "message-popup":MessagePopup,
          "confirmation-popup": ConfirmationPopup,
          "custom-command-cell": CommandCell,
    },
    beforeMount: function(){
        this.getChannelKeys();
    },
    mounted:function(){
    },
    computed: {
        result: {
            get: function() {
                return this.notificationList.slice(this.skip, this.take + this.skip);
            }
        }
    },
    data() {
      return {
       base_url: this.$config.notificationApiUrl,
       base_url_management:this.$config.notificationApiManagementUrl,
         skip:0,
        take:10,
        pageSize:10,
       messageModel: undefined,
       gridDataTotal:0,
      tempAppKey: undefined,
        channelKeyModel: undefined,
        deleteModel: undefined,
      errors: [],
      tags:undefined,
      notificationList: [],
      channelKeys: [],
      columns: [
        {
          field: "channelKey",
          editable: false,
          title: "Channel Key"
        },{
          field: "message",
          editable: false,
          title: "Message"
        },{
          field: "title",
          editable: false,
          title: "Title"
        },{
          field: "isAcknowledgementRequired",
          editable: false,
          title: "Is Acknowledgement Required"
        },
        {
          field: "tag",
          editable: false,
          title: "Tag"
        },
        {
           field: "expirationDate",
          editable: false,
          title: "Expiration Date"
        },
        {
           field: "severity",
          editable: false,
          title: "Severity",
          cell: this.modifySeverityColumn
        },
        {
           field: "action",
          editable: false,
          title: "Action"
        },
        {
           field: "allowDeletion",
          editable: false,
          title: "AllowDeletion"
        },
        {
           field: "icon",
          editable: false,
          title: "Icon"
        },
        {
           field: "clickAction",
          editable: false,
          title: "Click Action"
        },

        {
           field: "createdOn",
          editable: false,
          title: "CreatedOn"
        },
        { cell: "customCommandTemplate" },
      ],
      ddlDefault: {
        id: "",
        channelKey: "Select"
      },
    };
    },
    methods:{
        pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
      // exportExcel () {
      //       saveExcel({
      //           data: this.notificationList,
      //           fileName: "NotificationReport",
      //           columns: this.columns
      //       });
      //   },
        async getNotifications() {
      try {
          var stringList = this.tags.split(",").filter(d => d != "" && d != " ");
        axios.post(
          this.base_url_management + "GetNotifications/" + this.channelKeyModel.channelKey, stringList).then((response) => {  
              if(response.data.result != null){
              this.notificationList=response.data.result;
              
              }
              else{
                  this.notificationList = []
              }
              this.gridDataTotal =this.notificationList.length;
        });
      } catch (err) {
        this.messageModel = err.response.data;
      }
    },
        async getChannelKeys() {
      try {
        await axios.get(
          this.base_url_management + "GetChannelKeys").then((response) => {
                      this.channelKeys=response.data.result;
        console.log(response.data.result);
        });
      } catch (err) {
        this.messageModel = err.response.data;
      }
    },
    onChangeApplicationKey(event) {
      console.log("change", event.target.value);
      this.tempAppKey = event.target.value;      
    },
    validateForm(e){
        if(this.channelKeyModel && this.channelKeyModel.channelKey == "Select"){
            this.channelKeyModel = undefined;
        }     
        if(this.tags && $.trim(this.tags) == ""){
          this.tags = undefined;
        }
        this.errors = [];
        
       if(this.channelKeyModel && this.tags){
            this.getNotifications();
            this.errors = [];
            return true;
        }
        
      if (!this.channelKeyModel) {
        this.errors.push('Please select a Channel Key.');
      }
      if(!this.tags){
         this.errors.push('Please enter a tag.');
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
     async deleteNotification(dataItem){
        console.log("deleteNotification");
        try{
        await axios.post(this.base_url_management + "DeleteNotification/"+dataItem.id).then((response) => {
        this.getNotifications();
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    cancelConfirmation(){
      this.deleteModel = undefined;
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    modifySeverityColumn: function (h, tdElement , props, listeners ) {
            return h('td', [props.dataItem.severity == 0 ? "Low": "High"]);
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