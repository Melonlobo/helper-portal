<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">File Channels</h2>
            </div>
            <div>
              <form class="panel-heading p-0" @submit.prevent="validateForm">
                <div class="table-responsive">
                  <table class="table mb-0 text-left sm-font">
                    <tr>
                      <td class="custom-table-cell">
                          <label>Pool Name<span class="c-danger">*</span></label>
                      </td>
                      <td> 
                            <dropdownlist
                             :style="{'font-size': '12px'}"
                              :data-items="filePoolNames"   
                              :default-item="ddlDefault"   
                          :text-field="'name'"
                              :data-item-id="'id'"         
                              v-model="filePoolName"
                              @change="onChangePoolName">
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
                      <td class="btn-add-file-channel">
                          <button type="button" class="k-button k-secondary" @click="insert"><i class="fa fa-plus"></i>Add new</button>

                      </td>
                    </tr>
                  </table>
                </div>
              </form>
                <Grid ref="grid" :data-items="result"
                :style="{ height: '60vh' }" 
                 :columns="columns"
                 :pageable="true"
                 :total="gridDataTotal"
                  :resizable="true"
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
                <dialog-container v-if="fileChannelModel" :dialog-title="dialogTitle" :data-item="fileChannelModel" :filePoolNames="filePoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteFileChannel" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditFileChannel.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "FileChannels",
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
       base_url: this.$config.fileApiUrl,
       base_url_management:this.$config.fileApiManagementUrl,
       gridDataTotal:0,
         skip:0,
        take:10,
        pageSize:10,
        messageModel: undefined,
        fileChannels:[],
        filePoolNames: undefined,
        filePoolName: undefined,
        errors: [],
        selectedPoolName: undefined,
        selectedProviderName: undefined,
        ddlDefault: {
        id: "",
        name: "Select",
      },
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "key",
          editable: false,
          title: "Channel Key",
          //type: "text",
          //width: "150px" 
        },{
          field: "filePoolName",
          editable: false,
          title: "Pool Name",
          //type: "text",
          //width: "150px" 
        },{
          field: "fileProviderName",
          editable: false,
          title: "Provider Name",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
      fileChannelModel: undefined,
      deleteModel: undefined,
    };
    },
    beforeMount: function() {
        this.getFilePoolNames()
    },
    mounted:function(){
        //$(".k-grid-toolbar").addClass("custom-toolbar");
    },
     computed: {
        result: {
            get: function() {
                return this.fileChannels.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.fileChannelModel.id === undefined ? "Add" : "Edit"} File Channel`;
        }
    },
    methods: {
         pageChangeHandler: function(event) {
            this.skip = event.page.skip;
            this.take = event.page.take;
        },
     async getFilePoolNames(){
try{
        const response = await axios.get(this.base_url_management + "GetFilePoolNames");
        this.filePoolNames = response.data.result;
        }catch(err){
            console.log(err)
        }
    },
    async getFileChannels(){
        console.log("getFileChannels");
        try{
        const response = await axios.get(this.base_url_management + "GetFileChannelsByPool/"+this.selectedPoolName.id);
        if(response.data.status){
        this.fileChannels = response.data.result;
        }else{
          this.fileChannels = [];
        }
         this.gridDataTotal =this.fileChannels.length;
        }catch(err){
           this.messageModel = err.response.data;
        }
    },
    async registerFileChannel(dataItem){
        console.log("registerFileChannel");
        try{
        let data = {
            key : dataItem.key,
            filePoolID: dataItem.filePoolID,
            fileProviderID: dataItem.fileProviderID
        }
        await axios.post(this.base_url_management + "addFileChannel",data).then((response) => {
        //e.success(response.data.status);
        if(this.selectedPoolName != undefined){
        this.getFileChannels();
        }
        console.log(response);
      })
        }
        catch(err){
          this.messageModel = err.response.data;
        }
    },
    async updateFileChannel(dataItem){
        console.log("updateFileChannel");
        try{
            let data = {
                id: dataItem.id,
                key : dataItem.key,
                filePoolID: dataItem.filePoolID,
                fileProviderID: dataItem.fileProviderID
            }
        await axios.post(this.base_url_management + "updateFileChannel",data).then((response) => {
        //e.success(response.data.status);
       if(this.selectedPoolName != undefined){
        this.getFileChannels();
        }
        console.log(response);
      })
        }
        catch(err){
           this.messageModel = err.response.data;
        }
    },
     async deleteFileChannel(dataItem){
        console.log("deleteFileChannel");
        try{
        await axios.get(this.base_url_management + "deleteFileChannel/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       if(this.selectedPoolName != undefined){
        this.getFileChannels();
        }
        console.log(response);
      })
        }catch(err){
        this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.fileChannelModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.fileChannelModel;
      const isNewFileChannel = dataItem.id == undefined;
      if (!isNewFileChannel) {
        this.updateFileChannel(dataItem);
      } else {
        this.registerFileChannel(dataItem);
      }
      this.fileChannelModel = undefined;
    },
    cancelPopup() {
      this.fileChannelModel = undefined;
    },
    insert() {
      this.fileChannelModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    onChangePoolName(event){
         this.selectedPoolName = event.target.value;        
    },
    validateForm(e){
        if(this.selectedPoolName != undefined && this.selectedPoolName.name == "Select"){
            this.selectedPoolName = undefined
        }
        if(this.selectedPoolName){
            this.getFileChannels();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.selectedPoolName) {
        this.errors.push('Please select a Pool Name.');
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
.btn-add-file-channel{
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


