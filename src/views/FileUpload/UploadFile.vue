<template>
    <div class="file-upload">
        <div class="container-fluid">
        <div class="panel-heading">
             <h2 class="text-left">Upload File</h2>
            <form class="k-form" @submit.prevent="validateForm">
                <div style="height:465px">
              <div class="table-responsive">
              <table class="text-left mb-0 sm-font">
                   <colgroup>
                         <col span="1" style="width: 150px" />
                        <col span="1" style="width: 350px" />
                    </colgroup>
                <tr>
                    <td><label>Channel Key<span class="c-danger">*</span></label></td>
                    <td>
                        <dropdownlist
                         :style="{'font-size': '12px'}"
                         class="custom-input-width"
                          :data-items="fileChannelKeys"   
                          :default-item="ddlDefault"   
                      :text-field="'key'"
                          :data-item-id="'id'"         
                          v-model="uploadFileModel.channelKey"
                          @change="onChangeChannelKey">
                        </dropdownlist>
                        </td>
                </tr>
                <tr>
                    <td><label>Reference ID</label></td>
                    <td>
                        <k-input  
                         type="text"
                            :name="'referenceID'"   
                           class="custom-input-width" 
                          v-model="uploadFileModel.referenceID">
                        </k-input>
                    </td>                    
                </tr>
                <tr>
                    <td><label>Reference Type</label></td>
                    <td>
                         <k-input
                            type="text"
                            :name="'referenceType'"
                            v-model="uploadFileModel.referenceType"
                            class="custom-input-width"
                        ></k-input>
                    </td>
                </tr>
                 <tr>
                    <td><label>Tag</label></td>
                    <td>
                        <k-input
                            type="text"
                            :name="'tag'"
                            v-model="uploadFileModel.tag"
                            class="custom-input-width"
                        ></k-input>
                    </td>
                </tr>
                <tr>
                    <td><label>File</label></td>
                    <td>
                         <input
                type="file"
                id="fileUpload"
                @change="onFileSelection"
                class="imageButton custom-input-width"/>
                    </td>
                </tr>
                <tr><td></td><td>{{fileName}} </td></tr>
                 <tr>
                    <td></td>
                    <td>
                     <button class="k-button k-primary btn-popup mr-10" type="submit" tabindex="0">Upload</button>
                     <button class="k-button k-primary btn-popup" type="button" tabindex="0" @click="resetForm">Reset</button>
                     </td>
                </tr>
            </table>
              </div>
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
      base_url: this.$config.fileApiUrl,
       base_url_management:this.$config.fileApiManagementUrl,
       messageModel:undefined,
        fileChannelKeys:[],
        errors: [],
        fileName:undefined,
        ddlDefault: {
        id: "",
        key: "Select"
      },
      uploadFileModel: {
           channelKey: {
                        id:"",
                        key:"Select"
                        },
          tag: "",
          referenceID:"",
          referenceType:"",
          file: ''
      }
    };
    },
    beforeMount: function(){
        this.getFileChannelKeys();
    },
    methods:{
         async getFileChannelKeys(){
        try{
        const response = await axios.get(this.base_url_management + "GetFileChannelKeys");
        if(response.data.status){
            this.fileChannelKeys = response.data.result;
        }else{
            this.fileChannelKeys = [];
        }
        }catch(err){
            console.log(err)
        }
    },
    validateForm(e){
        if(this.uploadFileModel.channelKey.key && this.uploadFileModel.channelKey.key == "Select"){
            this.uploadFileModel.channelKey = undefined
        }
        if($.trim(this.uploadFileModel.referenceID) == ""){
            this.uploadFileModel.referenceID = ""
        }
        if($.trim(this.uploadFileModel.referenceType) == ""){
            this.uploadFileModel.referenceType = ""
        }
        if($.trim(this.uploadFileModel.tag) == ""){
            this.uploadFileModel.tag = ""
        }
        if(this.uploadFileModel.channelKey && this.uploadFileModel.file){
            this.uploadFile();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.uploadFileModel.channelKey) {
        this.errors.push('Please select a Channel Key.');
      }
      if (!this.uploadFileModel.file) {
        this.errors.push('Please select a file.');
      }

      e.preventDefault();
    },
    async uploadFile(){
        try{
        this.uploadFileModel.tag = this.uploadFileModel.tag ? this.uploadFileModel.tag : "";
        this.uploadFileModel.referenceID = this.uploadFileModel.referenceID ? this.uploadFileModel.referenceID : "";
        this.uploadFileModel.referenceType = this.uploadFileModel.referenceType ? this.uploadFileModel.referenceType : "";
        const formData = new FormData();     
        formData.append("file", this.uploadFileModel.file);
        await axios.post(this.base_url_management + "UploadFile?channelKey="+this.uploadFileModel.channelKey.key+"&referenceID="+this.uploadFileModel.referenceID+"&referenceType="+this.uploadFileModel.referenceType+"&tags="+this.uploadFileModel.tag,formData, {
        header: {
          "Content-Type": "multipart/form-data",
        }
        }).then((response) => {
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
        this.uploadFileModel.channelKey = event.target.value;
    },    
    resetForm(){
        $("#fileUpload").val('');
        this.uploadFileModel= {
          channelKey: {
                        id:"",
                        key:"Select"
                        },
          tag: "",
          referenceID:"",
          referenceType:"",
          file: undefined
      }
      this.fileName = "";
    },    
    errorPopupOk(){
      this.errors = [];
    },
    messagePopupOk(){
        this.messageModel = undefined;
    },
    onFileSelection(e) {
      var files = e.target.files || e.dataTransfer.files;
      console.log(files.length);
      this.uploadFileModel.file = files[0];
      this.fileName = files[0].name;
    },
    }
})
</script>
<style scoped>
table {
    border-collapse: separate;
    border-spacing: 0.5em 1em;
}
input{
    width:60%!important;
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
    width: 68vh!important;
}
</style>