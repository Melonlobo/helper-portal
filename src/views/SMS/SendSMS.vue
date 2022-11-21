<template>
    <div class="send-sms">
        <div class="container-fluid">
        <div class="panel-heading page-max-height">
             <h2 class="text-left">Send SMS</h2>
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
                        class="custom-input-width"
                        :style="{'font-size': '12px'}"
                          :data-items="smsChannelKeys"   
                          :default-item="ddlDefault"   
                      :text-field="'key'"
                          :data-item-id="'id'"         
                          v-model="sendSMSModel.channelKey"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                        </td>
                        
                </tr>
                <tr>
                    <td><label>Template Name<span class="c-danger">*</span></label></td>
                    <td>
                        <dropdownlist
                        class="custom-input-width"
                        :style="{'font-size': '12px'}"
                          :data-items="smsTemplates"   
                          :default-item="ddlDefault"   
                      :text-field="'name'"
                          :data-item-id="'id'"         
                          v-model="sendSMSModel.templateName"
                          @change="onChangeTemplateName">
                        </dropdownlist>
                    </td>                    
                </tr>
                <tr>
                    <td><label>Variant</label></td>
                    <td>
                         <k-input
                            type="text"
                            :name="'variant'"
                            v-model="sendSMSModel.variant"
                            class="custom-input-width"
                        ></k-input>
                    </td>
                </tr>
                <tr>
                    <td><label>Sender</label></td>
                    <td>
                         <k-input
                            type="text"
                            :name="'sender'"
                            v-model="sendSMSModel.sender"
                            class="custom-input-width"
                        ></k-input>
                    </td>
                </tr>
                <tr>
                    <td><label>Recipients<span class="c-danger">*</span></label></td>
                    <td>
                         <k-input
                            type="text"
                            :name="'recipients'"
                            v-model="sendSMSModel.recipients"
                            class="custom-input-width"
                            placeholder="Comma seperated if multiple recipients"
                            required
                        ></k-input>
                    </td>
                </tr>
                 <tr>
                    <td><label>Tag</label></td>
                    <td>
                        <k-input
                        class="custom-input-width"
                            type="text"
                            :name="'tag'"
                            v-model="sendSMSModel.tag"
                        ></k-input>
                    </td>
                </tr>
            </table>
            </div>
            <div class="col-sm-6">
              <table class="table text-left mb-0">
                  <tr>
                      <td>
                          <div v-if="smsTemplateLabel" id="templateDiv">
                              <h6>Template</h6>
                                <div class="sms-template-div">                              
                                <span>{{smsTemplateLabel}}</span>
                                </div>
                          </div>
                      </td>
                  </tr>
                <tr class="text-left">
                    <td v-if="smsTemplateLabel && this.numberOfKeys > 0">
                        <label>Message Parts<span class="c-danger">*</span></label>
                </td>
                </tr>
                <tr>
                    <td>
                        <div class="maxHeightTable">
                        <table id="messagePartsTable">
                        </table>
                        </div>
                    </td>   
                </tr>
            </table>
            </div>            
            </div>
                <div id="btnDiv">
                    <button class="col-4 k-button k-primary btn-popup mr-10" type="submit" tabindex="0">Send</button>
                    <button class="col-4 k-button k-primary btn-popup" type="button" tabindex="0" @click="resetForm">Reset</button>
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

export default({
    name:"SendEmail", 
    components: {
    "k-input": Input,
     dropdownlist: DropDownList, 
     "error-popup":ErrorPopup,
     "message-popup":MessagePopup
  },
    data() {
      return {
      base_url: this.$config.smsApiUrl,
       base_url_management:this.$config.smsApiManagementUrl,
        smsChannelKeys:[],
        smsTemplateLabel: undefined,
        smsTemplates:[],
        errors: [],
        ddlDefault: {
        id: "",
        key: "Select",
        name:"Select"
      },
      sendSMSModel: {
          channelKey: {
                        id:"",
                        key:"Select"
                        },
          templateName: {
              id:"",
              name:"Select"
          },
          tag: "",
          userName:"",
          messageBody:"",
          variant:"",
          sender:"",
          recipients:""
      },
      messageModel:undefined,
      numberOfKeys: 0
    };
    },
    beforeMount: function(){
        this.getSMSChannelKeys();
    },
    methods:{
         async getSMSChannelKeys(){
        try{
        const response = await axios.get(this.base_url_management + "GetSMSChannelKeys");
        if(response.data.status){
            this.smsChannelKeys = response.data.result;
        }else{
            this.smsChannelKeys = [];
        }
        }catch(err){
            console.log(err)
        }
    },
    validateForm(e){
        var messagePartsErrorArray = [];
        if(this.sendSMSModel.channelKey.key && this.sendSMSModel.channelKey.key == "Select"){
            this.sendSMSModel.channelKey = undefined
        }
        if(this.sendSMSModel.templateName.name && this.sendSMSModel.templateName.name == "Select"){
            this.sendSMSModel.templateName = undefined
        }
        if($.trim(this.sendSMSModel.recipients) == ""){
            this.sendSMSModel.recipients = undefined
        }
        if($.trim(this.sendSMSModel.tag) == ""){
            this.sendSMSModel.tag = undefined
        }
        if($.trim(this.sendSMSModel.variant) == ""){
            this.sendSMSModel.variant = undefined
        }
         var table=$("#messagePartsTable")[0];  
        var rowCount = table.rows.length;
        for(var i=0;i<rowCount;i++){
            var row= table.rows[i];
            var key = row.cells[0].childNodes[0].value.trim();
            var value = row.cells[1].childNodes[0].value.trim();
            if(key == "" || value == ""){
                messagePartsErrorArray.push(true);
            }else{
                messagePartsErrorArray.push(false);
            }
        }
        if(this.sendSMSModel.channelKey && this.sendSMSModel.templateName && !messagePartsErrorArray.includes(true)){
            this.sendSMS();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.sendSMSModel.channelKey) {
        this.errors.push('Please select a Channel Key.');
      }
      if (!this.sendSMSModel.templateName) {
        this.errors.push('Please select a Template Name.');
      }
      if(!this.sendSMSModel.recipients){
          this.errors.push('Please enter a Recipient.');
      }
      if(messagePartsErrorArray.includes(true)){
          this.errors.push('Please enter the Message Parts.');
      }

      e.preventDefault();
    },
    async sendSMS(){

        this.sendSMSModel.variant = this.sendSMSModel.variant ? this.sendSMSModel.variant : "";
        this.sendSMSModel.tag = this.sendSMSModel.tag ? this.sendSMSModel.tag : "";
       var messagePartsDictionary = {};
        var table=$("#messagePartsTable")[0];  
        var rowCount = table.rows.length; 
        for(var i=0;i<rowCount;i++){
            var row= table.rows[i];
            var key = row.cells[0].childNodes[0].value;
            var value = row.cells[1].childNodes[0].value;
            messagePartsDictionary[key] = value;
        }
        let data = {
            templateName : this.sendSMSModel.templateName.name,
            Channelkey: this.sendSMSModel.channelKey.key,
            variant: this.sendSMSModel.variant,
            sender: this.sendSMSModel.sender,
            recipients: this.sendSMSModel.recipients,
            messageParts: messagePartsDictionary,
            Tag: this.sendSMSModel.tag
        }
        await axios.post(this.base_url_management + "SendSMS",data).then((response) => {
        if(response.data.status){
            this.resetForm();
            this.messageModel = response.data;
        }else{
            this.messageModel = response.data;
        }
        console.log(response);
      })
    },
    onChangeChannelKey(event) {
        this.sendSMSModel.channelKey = event.target.value;
      if(this.sendSMSModel.channelKey && this.sendSMSModel.channelKey.key != "Select"){
        axios.get(
          this.base_url_management + "GetSMSTemplatesByChannelID/"+this.sendSMSModel.channelKey.id).then((response) => { 
              if(response.data.result != null && response.data.result.length > 0){ 
              this.smsTemplates =response.data.result;
              }else{
                  this.smsTemplates = [];
              }
              this.sendSMSModel.templateName.name = "Select";
        console.log(response.data.result);
        });
           }
           else{
               this.smsTemplates = [];
               this.sendSMSModel.templateName.name = "Select";
           }
           this.smsTemplateLabel = undefined;
           $("#messagePartsTable tr").remove();
               this.numberOfKeys = 0;
    },
    onChangeTemplateName(event){
        this.sendSMSModel.templateName = event.target.value;
         if(this.sendSMSModel.templateName.name != "Select"){
            axios.get( this.base_url_management + "GetSMSTemplateByID/"+this.sendSMSModel.templateName.id).then(response =>{
            if(response.data.status){
                this.smsTemplateLabel = response.data.result.messageTemplate;
                 $("#messagePartsTable tr").remove();
                this.numberOfKeys = 0;
                this.createMessagePartsRows();
            }
            else{
                this.smsTemplateLabel = undefined;
                $("#messagePartsTable tr").remove();
            }
            });
        }else{
            this.smsTemplateLabel = undefined;
            $("#messagePartsTable tr").remove();
        }
    },
    resetForm(){
        this.smsTemplates = []
        this.sendSMSModel= {
          channelKey: {
                        id:"",
                        key:"Select"
                        },
          templateName: {
              id:"",
              name:"Select"
          },
          tag: "",
          userName:"",
          messageBody:"",
          variant:"",
          sender:"",
          recipients:""
      };
      this.smsTemplateLabel = undefined;
      $("#messagePartsTable tr").remove();
       this.numberOfKeys = 0;
    },    
    errorPopupOk(){
      this.errors = [];
    },
    messagePopupOk(){
        this.messageModel = undefined;
    },
    addRow(keyRowValue) {  
    var table = $("#messagePartsTable")[0];  
    var rowCount = table.rows.length;  
    var row = table.insertRow(rowCount);  
    //Column 1  
    var cell1 = row.insertCell(0);  
    var element1 = document.createElement("input");  
    element1.type = "text";
    element1.placeholder = "key"+rowCount;
    element1.setAttribute("class","k-textbox");
    element1.setAttribute("disabled",true);
    element1.setAttribute("value", keyRowValue)
   // element1.name = btnName;  
    //element1.setAttribute('value', 'Delete'); // or element1.value = "button";  
    // element1.onclick = function() {  
    //     removeRow(btnName);  
    // }  
    cell1.appendChild(element1);
    //Column 2 
    var cell2 = row.insertCell(1);  
    var element2 = document.createElement("input");  
    element2.type = "text";  
    element2.placeholder = "value";
    element2.setAttribute("class","k-textbox");
    element2.setAttribute("required",true);
    cell2.appendChild(element2);
    },
    createMessagePartsRows(){
        var regExp = new RegExp(/\{(.*?)\}/g);
        var matchedData = this.smsTemplateLabel.match(regExp);
        if(matchedData && matchedData != null){
            this.numberOfKeys = matchedData.length;
            matchedData.forEach(match => {
                match = match.replace(/[^\w\s]/gi, '')
                this.addRow(match);
            });
        }
    }
    }
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
    bottom:40px;
    left: 515px;
    height: 450px;
}


.maxHeightTable{
    height: 160px;
    overflow-y: auto;
}

table#messagePartsTable{
position: relative;
}

table td{
    border: 0!important;
    padding: 0.2rem !important;
}

.sms-template-div{
    overflow-y: auto;
    height: 49px;
    padding: 5px;
}

.custom-input-width{
    width: 50vh;
}

div#templateDiv{
    height:60px;
    border:1px solid black;
}
h6{
    width:68px;
    margin-bottom: 0px;
    margin-top:-10px;
    margin-left:5px;
    background:white;
}

#btnDiv{
    margin-top: 96px;
}

.page-max-height{
    height: 510px;
}
</style>