<template>
    <div class="application">
        <div class="container-fluid">
          <div class="panel-heading">
            <h2 class="text-left">File Providers</h2>
            </div>
            <div>
                <!-- <div class="row">
                    <button title="Add new" class="m-2 k-button k-primary" @click="insert"><i class="fa fa-plus mr-2"></i>Add new</button>
                </div> -->
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
                          v-model="filepoolName"
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
                  <td class="btn-add-file-provider">
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
                <dialog-container v-if="fileProviderModel" :dialog-title="dialogTitle" :data-item="fileProviderModel" :filePoolNames="filePoolNames" @save="savePopup" @cancel="cancelPopup">
                </dialog-container>
                <error-popup v-if="errors.length > 0" :errors="errors" @cancel="errorPopupOk"></error-popup>
                <confirmation-popup v-if="deleteModel" :data-item="deleteModel" @confirm="deleteFileProvider" @cancel="cancelConfirmation"></confirmation-popup>
                <message-popup v-if="messageModel" :model="messageModel" :responseStatus="messageModel.status" @cancel="messagePopupOk"></message-popup>
            </div>
        </div>
    </div>
</template>

<script>
import { Grid } from "@progress/kendo-vue-grid";
import axios from "axios";
import DialogContainer from "./AddEditFileProviders.vue";
import CommandCell from "../shared/CommandCell.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ErrorPopup from "../shared/ErrorPopup.vue";
import ConfirmationPopup from "../shared/ConfirmationPopup.vue"
import MessagePopup from "../shared/MessagePopup.vue";

export default ({
    name: "FileProviders",
    components: {
         Grid: Grid,
         "dialog-container": DialogContainer,
         "custom-command-cell": CommandCell,
         dropdownlist: DropDownList, 
         "error-popup":ErrorPopup,
         "confirmation-popup": ConfirmationPopup,
         "message-popup":MessagePopup       
    },
    data() {
      return {
     base_url: this.$config.fileApiUrl,
       base_url_management:this.$config.fileApiManagementUrl,
        fileProviders:[],
        filePoolNames: undefined,
        filepoolName: undefined,
        errors: [],
         messageModel: undefined,
        gridDataTotal:0,
         skip:0,
        take:10,
        pageSize:10,
      columns: [
        {
          hidden: true,
          field: "id",
          editable: false,
          title: "ID",
        },{
          field: "name",
          editable: false,
          title: "File Provider Name",
          //type: "text",
          //width: "150px" 
        },{
          field: "type",
          editable: false,
          title: "Type",
          //type: "text",
          //width: "150px" 
        },{
          field: "configuration",
          editable: false,
          title: "Configuration",
          //type: "text",
          //width: "150px" 
        },
        { cell: "customCommandTemplate" },
      ],
       ddlDefault: {
        id: "",
        name: "Select",
      },
      fileProviderModel: undefined,
      deleteModel: undefined
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
                return this.fileProviders.slice(this.skip, this.take + this.skip);
            }
        },
    dialogTitle() {
      return `${this.fileProviderModel.id === undefined ? "Add" : "Edit"} File Provider`;
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
              this.messageModel = err.response.data;
        }
    }, 
    onChangePoolName(event){
         this.filePoolName = event.target.value;        
    },
    async getFileProviders(){
        console.log("getFileProviders");
        try{
        const response = await axios.get(this.base_url_management + "GetFileProviders/"+ this.filepoolName.id);
        if(response.data.status){
        this.fileProviders = response.data.result;
        }else{
          this.fileProviders = [];
        }
        this.gridDataTotal =this.fileProviders.length;
        }catch(err){
             this.messageModel = err.response.data;
        }
    },
    async registerFileProvider(dataItem){
        console.log("registerFileProvider");
        try{
        let data = {
            name : dataItem.name,
            type: dataItem.type,
            configuration: dataItem.configuration,
            filePoolID: dataItem.filePoolName
        }
        await axios.post(this.base_url_management + "addFileProvider",data).then((response) => {
        //e.success(response.data.status);
        if(this.filepoolName != undefined){
       this.getFileProviders();
        }
        console.log(response);
      })
        }
        catch(err){
            this.messageModel = err.response.data;
        }
    },
    async updateFileProvider(dataItem){
        console.log("updateFileProvider");
        try{
            let data = {
                id: dataItem.id,
            name : dataItem.name,
            type: dataItem.type,
            configuration: dataItem.configuration,
            filePoolName: dataItem.filePoolName,
            filePoolID: dataItem.filePoolID
        }
        await axios.post(this.base_url_management + "updateFileProvider",data).then((response) => {
        //e.success(response.data.status);
        if(this.filepoolName != undefined){
       this.getFileProviders();
        }
        console.log(response);
      })
        }
        catch(err){
             this.messageModel = err.response.data;
        }
    },
     async deleteFileProvider(dataItem){
        console.log("deleteFileProvider");
        try{
        await axios.get(this.base_url_management + "DeleteFileProvider/"+dataItem.id).then((response) => {
        //e.success(response.data.status);
       if(this.filepoolName != undefined){
       this.getFileProviders();
        }
        console.log(response);
      })
        }catch(err){
          this.messageModel = err.response.data;
        }
        this.deleteModel = undefined;
    },
    edit(dataItem) {
      this.fileProviderModel = this.cloneProduct(dataItem);
    },
    savePopup() {
      const dataItem = this.fileProviderModel;
      const isNewFileProvider = dataItem.id == undefined;
      if (!isNewFileProvider) {
        this.updateFileProvider(dataItem);
      } else {
        this.registerFileProvider(dataItem);
      }
      this.fileProviderModel = undefined;
    },
    cancelPopup() {
      this.fileProviderModel = undefined;
    },
    insert() {
      this.fileProviderModel = {};
    },
    cloneProduct(product) {
      return Object.assign({}, product);
    },
    validateForm(e){
        if(this.filepoolName != undefined && this.filepoolName.name == "Select"){
            this.filepoolName = undefined
        }
        if(this.filepoolName){
            this.getFileProviders();
            this.errors = [];
            return true;
        }
        this.errors = [];
      if (!this.filepoolName) {
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
.btn-add-file-provider{
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
