<template>
    <div class="send-email">
        <div class="container-fluid">
        <div class="panel-heading page-max-height">
             <h2 class="text-left">Send Email</h2>
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
                            :style="{'font-size': '12px'}"
                            class="custom-input-width"
                          :data-items="emailChannelKeys"   
                          :default-item="ddlDefault"   
                      :text-field="'key'"
                          :data-item-id="'id'"         
                          v-model="sendEmailModel.channelKey"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                        </td>
                                       
                </tr>
                <tr>
                    <td><label>Template Name<span class="c-danger">*</span></label></td>
                    <td>
                        <dropdownlist
                            :style="{'font-size': '12px'}"
                            class="custom-input-width"
                          :data-items="emailTemplates"   
                          :default-item="ddlDefault"   
                      :text-field="'name'"
                          :data-item-id="'id'"         
                          v-model="sendEmailModel.templateName"
                          @change="onChangeTemplateName">
                        </dropdownlist>
                        
                    </td>      
                             
                </tr>
                <tr>
                    <td><label>Variant</label></td>
                    <td>
                         <k-input class="custom-input-width"
                            type="text"
                            :name="'variant'"
                            v-model="sendEmailModel.variant"
                        ></k-input>
                    </td>
                </tr>
                <tr>
                    <td><label>Sender</label></td>
                    <td>
                         <k-input class="custom-input-width"
                            type="text"
                            :name="'sender'"
                            v-model="sendEmailModel.sender"
                        ></k-input>
                    </td>
                </tr>
                <tr>
                    <td><label>Recipients<span class="c-danger">*</span></label></td>
                    <td>
                         <k-input class="custom-input-width"
                            type="text"
                            :name="'recipients'"
                            v-model="sendEmailModel.recipients"
                            placeholder="Comma seperated if multiple recipients"
                            required
                        ></k-input>
                    </td>
                </tr>
                <tr>
                    <td><label>Subject</label></td>
                    <td>
                        <k-input class="custom-input-width"
                            type="text"
                            :name="'subject'"
                            v-model="sendEmailModel.subject"
                        ></k-input>
                    </td>
                </tr>
                <tr>
                     <td><label>Tag</label></td>
                    <td>
                        <k-input class="custom-input-width"
                            type="text"
                            :name="'tag'"
                            v-model="sendEmailModel.tag"
                        ></k-input>
                    </td>
                </tr>                
            </table>
                </div>

                <div class="col-sm-6">
                     
              <table class="table text-left mb-0" >
                  <tr>
                      <td>
                          <div v-if="emailTemplateLabel" id="templateDiv">
                              <h6>Template</h6>
                          <div class="email-template-div">                              
                                <span>{{emailTemplateLabel}}</span>
                            </div>
                          </div>
                      </td>
                  </tr>
                <tr class="text-left">
                    <td v-if="emailTemplateLabel && this.numberOfKeys > 0">
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
      base_url: this.$config.emailApiUrl,
       base_url_management:this.$config.emailApiManagementUrl,
        emailChannelKeys:[],
        emailTemplates:[],
        errors: [],
        ddlDefault: {
        id: "",
        key: "Select",
        name:"Select"
      },
        messageModel:undefined,
      emailTemplateLabel:undefined,
      numberOfKeys: 0,
      sendEmailModel: {
          channelKey: {
                        id:"",
                        key:"Select"
                        },
          templateName: {
              id:"",
              name:"Select"
          },
          tag: "",
          subject:"",
          userName:"",
          messageBody:"",
          variant:"",
          sender:"",
          recipients:""
      }
    };
    },
    beforeMount: function(){
        this.getEmailChannelKeys();
    },
    methods:{
         async getEmailChannelKeys(){
        try{
        const response = await axios.get(this.base_url_management + "GetEmailChannelKeys");
        if(response.data.status){
            this.emailChannelKeys = response.data.result;
        }else{
            this.emailChannelKeys = [];
        }
        }catch(err){
            console.log(err)
        }
    },
    validateForm(e){
        var messagePartsErrorArray = [];
        if(this.sendEmailModel.channelKey && this.sendEmailModel.channelKey.key && this.sendEmailModel.channelKey.key == "Select"){
            this.sendEmailModel.channelKey = undefined
        }
        if(this.sendEmailModel.templateName && this.sendEmailModel.templateName.name && this.sendEmailModel.templateName.name == "Select"){
            this.sendEmailModel.templateName = undefined
        }
        if($.trim(this.sendEmailModel.recipients) == ""){
            this.sendEmailModel.recipients = undefined
        }
        if($.trim(this.sendEmailModel.subject) == ""){
            this.sendEmailModel.subject = undefined
        }
        if($.trim(this.sendEmailModel.tag) == ""){
            this.sendEmailModel.tag = undefined
        }
        if($.trim(this.sendEmailModel.variant) == ""){
            this.sendEmailModel.variant = undefined
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
        if(this.sendEmailModel.channelKey && this.sendEmailModel.templateName && !messagePartsErrorArray.includes(true)){
            this.sendEmail();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.sendEmailModel.channelKey) {
        this.errors.push('Please select a Channel Key.');
      }
      if (!this.sendEmailModel.templateName) {
        this.errors.push('Please select a Template Name.');
      }
      if(!this.sendEmailModel.recipients){
          this.errors.push('Please enter a Recipient.');
      }
      if(messagePartsErrorArray.includes(true)){
          this.errors.push('Please enter the Message Parts.');
      }

      e.preventDefault();
    },
    async sendEmail(){
        var messagePartsDictionary = {};
        var table=$("#messagePartsTable")[0];  
        var rowCount = table.rows.length; 
        this.sendEmailModel.variant = this.sendEmailModel.variant ? this.sendEmailModel.variant : "";
        this.sendEmailModel.tag = this.sendEmailModel.tag ? this.sendEmailModel.tag : "";
        this.sendEmailModel.subject = this.sendEmailModel.subject ? this.sendEmailModel.subject : "";

        this.sendEmailModel.referenceType = this.sendEmailModel.referenceType ? this.sendEmailModel.referenceType : "";
        var recipientsList = this.sendEmailModel.recipients.split(",").filter(function (el) {
                    return el != null && el != "" && el != " ";
                    });
        for(var i=0;i<rowCount;i++){
            var row= table.rows[i];
            var key = row.cells[0].childNodes[0].value;
            var value = row.cells[1].childNodes[0].value;
            messagePartsDictionary[key] = value;
        }
        let data = {
            templateName : this.sendEmailModel.templateName.name,
            Channelkey: this.sendEmailModel.channelKey.key,
            variant: this.sendEmailModel.variant,
            sender: this.sendEmailModel.sender,
            recipients: recipientsList,
            subject: this.sendEmailModel.subject,
            messageParts: messagePartsDictionary,
            Tag: this.sendEmailModel.tag
        }
        await axios.post(this.base_url_management + "SendMail",data).then((response) => {
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
        this.sendEmailModel.channelKey = event.target.value;
      if(this.sendEmailModel.channelKey && this.sendEmailModel.channelKey.key != "Select"){
        axios.get(
          this.base_url_management + "GetEmailTemplatesByChannelID/"+this.sendEmailModel.channelKey.id).then((response) => { 
              if(response.data.result != null && response.data.result.length > 0){ 
              this.emailTemplates =response.data.result;
              }else{
                  this.emailTemplates = [];
              }
              
              this.sendEmailModel.templateName.name = "Select";
              
        console.log(response.data.result);
        });
           }
           else{
               this.emailTemplates = [];
               this.sendEmailModel.templateName.name = "Select";
           }
           this.emailTemplateLabel = undefined;
           $("#messagePartsTable tr").remove();
               this.numberOfKeys = 0;
    },
    onChangeTemplateName(event){
        this.sendEmailModel.templateName = event.target.value;
        if(this.sendEmailModel.templateName.name != "Select"){
            axios.get( this.base_url_management + "GetEmailTemplateByID/"+this.sendEmailModel.templateName.id).then(response =>{
            if(response.data.status){
                this.emailTemplateLabel = response.data.result.messageTemplate;
                 $("#messagePartsTable tr").remove();
                 this.numberOfKeys = 0;
                this.createMessagePartsRows();
            }
            else{
                this.emailTemplateLabel = undefined;
                $("#messagePartsTable tr").remove();
            }
            });
        }else{
            this.emailTemplateLabel = undefined;
            $("#messagePartsTable tr").remove();
        }
    },
    resetForm(){
        this.emailTemplates = []
        this.sendEmailModel= {
          channelKey: {
                        id:"",
                        key:"Select"
                        },
          templateName: {
              id:"",
              name:"Select"
          },
          tag: "",
          subject:"",
          variant:"",
          sender:"",
          recipients:""
      };
      this.emailTemplateLabel = undefined;
       $("#messagePartsTable tr").remove();
       this.numberOfKeys = 0;
    },    
    errorPopupOk(){
      this.errors = [];
    },
    addRow(keyRowValue) {  
    var table = $("#messagePartsTable")[0];  
    var length = table.rows.length;
    var rowCount = length;  
    var row = table.insertRow(rowCount);  
    //Column 1  
    var cell1 = row.insertCell(0);  
    var element1 = document.createElement("input");  
    element1.type = "text";
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
        var matchedData = this.emailTemplateLabel.match(regExp);
        if(matchedData && matchedData != null){
            this.numberOfKeys = matchedData.length;
            matchedData.forEach(match => {
                match = match.replace(/[^\w\s]/gi, '')
                this.addRow(match);
            });
        }
    },
    messagePopupOk(){
        this.messageModel = undefined;
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
    bottom:37px;
    left: 515px;
    height: 450px;
}

table td{
    border: 0!important;
    padding: 0.2rem !important;
}

.maxHeightTable{
    height: 209px;
    overflow-y: auto;
}

table#messagePartsTable{
position: relative;
}

.email-template-div{
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

.page-max-height{
    height: 510px;
}


#btnDiv{
    margin-top: 45px;
}
</style>