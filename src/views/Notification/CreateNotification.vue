<template>
    <div class="file-upload">
        <div class="container-fluid">
        <div class="panel-heading">
             <h2 class="text-left">Create Notification</h2>
            <form class="k-form" @submit.prevent="validateForm">
                <div style="height:395px">
              <div class="col-md-6">
              <table class="text-left mb-0 sm-font">
                   <colgroup>
                         <col span="1" style="width: 150px" />
                        <col span="1" style="width: 250px" />
                    </colgroup>
                <tr>
                    <td><label>Channel Key<span class="c-danger">*</span></label></td>
                    <td>
                        <dropdownlist
                         :style="{'font-size': '12px'}"
                         class="custom-input-width"
                          :data-items="notificationChannelKeys"   
                          :default-item="ddlDefault"   
                      :text-field="'channelKey'"
                          :data-item-id="'id'"         
                          v-model="createNotificationModel.channelKey"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                        </td>
                </tr>           
                 <tr>
                    <td><label>Expiration Date</label></td>
                    <td>
                        <datepicker  :style="{'font-size': '12px'}" :default-Show="true" v-model="createNotificationModel.expirationDate" :format="'MM/dd/yyyy'"
                        :format-placeholder="'formatPattern'">
                    </datepicker>
                    </td>
                </tr>     
                <tr>
                    <td><label>Action</label></td>
                    <td>
                         <k-input
                            type="text"
                            :name="'action'"
                            v-model="createNotificationModel.action"
                            placeholder=""
                            class="custom-input-width"
                        ></k-input>
                    </td>
                </tr>
                 <tr>
                    <td><label>Tags<span class="c-danger">*</span></label></td>
                    <td>
                        <k-input
                            type="text"
                            :name="'tag'"                            
                            v-model="createNotificationModel.tags"
                            class="custom-input-width"
                            placeholder="Comma seperated if multiple"
                            required
                        ></k-input>
                    </td>
                </tr>
                <tr>
                    <td><label>Is User Acknowledgement Required</label></td>
                    <td>
                         <input
                            type="checkbox"
                            :name="'isAcknowledgementRequired'"
                            v-model="createNotificationModel.isAcknowledgementRequired"
                            class="custom-input-width"
                            @change="onChangeIsAcknowledgementRequired($event)"
                        />
                    </td>
                </tr>
                 <tr>
                    <td><label>Allow Deletion</label></td>
                    <td>
                         <input
                            type="checkbox"
                            :name="'allowDeletion'"
                            v-model="createNotificationModel.allowDeletion"
                            class="custom-input-width"
                            id="allowDeletion"
                        />
                    </td>
                </tr>
                 <tr>
                    <td><label>Severity</label></td>
                    <td>
                       <input
                            type="radio"
                            :name="'severity'"
                            v-model="createNotificationModel.severity"
                            value="0"
                        /> Low
                        <input
                            type="radio"
                            :name="'severity'"
                            v-model="createNotificationModel.severity"
                            value="1"
                        /> High
                    </td>
                </tr>
            </table>
              </div>
              <div class="col-md-6">
            <table class="table text-left mb-0" style="margin-left: 500px">
                  <colgroup>
                         <col span="1" style="width: 200px" />
                        <col span="1" style="width: 250px" />
                    </colgroup>
                  <tr>
                      <td><label>Title<span class="c-danger">*</span></label></td>
                    <td>
                        <k-input  
                         type="text"
                            :name="'title'"   
                           class="custom-input-width" 
                          v-model="createNotificationModel.title"
                          required
                          >                          
                        </k-input>
                    </td>       
                  </tr>
                  <tr>
                    <td><label>Message<span class="c-danger">*</span></label></td>
                    <td>
                        <k-input  
                         type="text"
                            :name="'message'"   
                           class="custom-input-width" 
                          v-model="createNotificationModel.message"
                          required
                          >                          
                        </k-input>
                    </td>                    
                </tr>
                <tr>
                      <td><label>Icon</label></td>
                    <td>
                        <k-input  
                         type="text"
                            :name="'icon'"   
                           class="custom-input-width" 
                          v-model="createNotificationModel.icon"
                          >                          
                        </k-input>
                    </td>         
                </tr>
                 <tr>
                      <td><label>Click Action</label></td>
                    <td>
                        <k-input  
                         type="text"
                            :name="'clickAction'"   
                           class="custom-input-width" 
                          v-model="createNotificationModel.clickAction"
                          >                          
                        </k-input>
                    </td>         
                </tr>
                <tr>
                      <td><label>Send Notification via firebase</label></td>
                    <td>
                        <input  
                         type="checkbox"
                        :name="'IsSendFirebaseNotificationEnabled'"
                          v-model="createNotificationModel.IsSendFirebaseNotificationEnabled"
                           class="custom-input-width"
                            id="IsSendFirebaseNotificationEnabled"
                          />
                    </td>         
                </tr>
            </table>
              </div>
                </div>
                <div>
                 <button class="k-button k-primary btn-popup mr-10" type="submit" tabindex="0">Save</button>
                     <button class="k-button k-primary btn-popup" type="button" tabindex="0" @click="resetForm">Reset</button>
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
import Switch from '@progress/kendo-inputs-vue-wrapper';
import { DatePicker } from '@progress/kendo-vue-dateinputs';

export default({
    name:"SendEmail", 
    components: {
    "k-input": Input,
     dropdownlist: DropDownList, 
     "error-popup":ErrorPopup,
     "datepicker": DatePicker,
     "message-popup":MessagePopup,
     "kendo-switch": Switch
  },
    data() {
      return {
      base_url: this.$config.notificationApiUrl,
       base_url_management:this.$config.notificationApiManagementUrl,
       messageModel:undefined,
        notificationChannelKeys:[],
        errors: [],
        fileName:undefined,
        ddlDefault: {
        id: "",
        channelKey: "Select"
      },
      createNotificationModel: {
           channelKey: {
                        id:"",
                        channelKey:"Select"
                        },
          tags: "",
          expirationDate:null,
          isAcknowledgementRequired:false,
          allowDeletion: false,
          message: "",
          action: "",
          title: "",
          icon: "",
          clickAction: "",
          severity: 0,
          IsSendFirebaseNotificationEnabled: false
      }
    };
    },
    beforeMount: function(){
        this.getNotificationChannelKeys();
    },
    methods:{
         async getNotificationChannelKeys(){
        try{
        const response = await axios.get(this.base_url_management + "GetChannelKeys");
        if(response.data.status){
            this.notificationChannelKeys = response.data.result;
        }else{
            this.notificationChannelKeys = [];
        }
        }catch(err){
            console.log(err)
        }
    },
    validateForm(e){
        if(this.createNotificationModel.channelKey.key && this.createNotificationModel.channelKey.key == "Select"){
            this.createNotificationModel.channelKey = undefined
        }
        if($.trim(this.createNotificationModel.action) == ""){
            this.createNotificationModel.action = ""
        }
        if($.trim(this.createNotificationModel.tag) == ""){
            this.createNotificationModel.tag = undefined;
        }
        if($.trim(this.createNotificationModel.message) == ""){
            this.createNotificationModel.message = undefined;
        }
         if($.trim(this.createNotificationModel.title) == ""){
            this.createNotificationModel.title = undefined;
        }
        if($.trim(this.createNotificationModel.icon) == ""){
            this.createNotificationModel.icon = "";
        }
        if($.trim(this.createNotificationModel.clickAction) == ""){
            this.createNotificationModel.clickAction = "";
        }
        if(this.createNotificationModel.channelKey && this.createNotificationModel.tags && this.createNotificationModel.message && this.createNotificationModel.title){
            this.createNotification();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.createNotificationModel.channelKey) {
        this.errors.push('Please select a Channel Key.');
      }
      if (!this.createNotificationModel.tags) {
        this.errors.push('Please enter a Tag.');
      }
      if (!this.createNotificationModel.message) {
        this.errors.push('Please enter a Message.');
      }
       if (!this.createNotificationModel.title) {
        this.errors.push('Please enter a Title.');
      }

      e.preventDefault();
    },
    async createNotification(){
        try{
        this.createNotificationModel.expirationDate = this.createNotificationModel.expirationDate ? this.createNotificationModel.expirationDate : null;
         var tagsList = this.createNotificationModel.tags.split(",").filter(function (el) {
                    return el != null && el != "" && el != " ";
                    });
        let dataToPost = {
            channelKey : this.createNotificationModel.channelKey.channelKey,
            action:this.createNotificationModel.action,
            isAcknowledgementRequired:this.createNotificationModel.isAcknowledgementRequired,
            allowDeletion: !this.createNotificationModel.isAcknowledgementRequired,
            tags: tagsList,
            message: this.createNotificationModel.message,            
            severity: parseInt(this.createNotificationModel.severity),
            title : this.createNotificationModel.title,
            icon: this.createNotificationModel.icon,
            clickAction: this.createNotificationModel.clickAction,
            IsSendFirebaseNotificationEnabled: this.createNotificationModel.IsSendFirebaseNotificationEnabled
        };
        if(this.createNotificationModel.expirationDate && this.createNotificationModel.expirationDate != null){
            //dataToPost.expirationDate= this.createNotificationModel.expirationDate;
            dataToPost.expirationDay = this.createNotificationModel.expirationDate.getDate();
            dataToPost.expirationMonth = this.createNotificationModel.expirationDate.getMonth() + 1;
            dataToPost.expirationYear = this.createNotificationModel.expirationDate.getFullYear();
        }
        await axios.post(this.base_url_management + "createnotification", dataToPost)
        .then((response) => {
        if(response.data.status){
            this.resetForm();
            this.messageModel = response.data;
        }else{
            this.messageModel = response.data;
        }
        console.log(response);
            })
        }
        catch(err){
            console.log(err)
        }
    },
    onChangeChannelKey(event) {
        this.createNotificationModel.channelKey = event.target.value;
    },    
    resetForm(){
        $("#allowDeletion").prop("disabled",false);
        this.createNotificationModel= {
          channelKey: {
                        id:"",
                        channelKey:"Select"
                        },
          tags: "",
          expirationDate:null,
          isAcknowledgementRequired:false,
          allowDeletion: false,
          action: "",
          severity: "0",
          message: "",
          title: "",
          icon: "",
          clickAction: "",
          IsSendFirebaseNotificationEnabled: false
      }
    },    
    errorPopupOk(){
      this.errors = [];
    },
    messagePopupOk(){
        this.messageModel = undefined;
    },
    onChangeIsAcknowledgementRequired(event){
        if(event.target.checked){
            $("#allowDeletion").prop("checked",false);
            $("#allowDeletion").prop("disabled",true);
        }else{
            $("#allowDeletion").prop("disabled",false);
        }
    }
    }
})
</script>
<style scoped>
table {
    table-layout:fixed;
    border-collapse: separate;
    border-spacing: 0.3em 0.2em;
    position: absolute;
    display: block;
    width: 50%;
}
input{
    width:40%!important;
}
span{
    margin-right: 0px!important;
}
.imageButton {
  display: block;
  position: relative;
  width: 60%;
  cursor: pointer;
  border: 0;
  height: 30px;
  color: transparent;
  border-radius: 5px;
  outline: 0;
}
.imageButton:hover:after {
  background: #79ccf0;
}
.imageButton:after {
  transition: 200ms all ease;
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  background: #f1f1f1;
  color: #000;
  font-size: 15px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  content: "Upload File";
  line-height: 30px;
  border-radius: 5px;
}

.custom-input-width{
    width: 45vh!important;
    margin-right: 0px!important;
}

input[type="radio"]{
    width: 10px !important;
}
</style>