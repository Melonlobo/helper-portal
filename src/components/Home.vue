<template>
  <div class="home-page">
    <div class="panel-group container">
       <kendo-tabstrip>
        <ul>
            <li class="k-state-active">
                <i class="fas fa-book"></i>Audit Log
            </li>
            <li>
               <i class="fas fa-envelope"></i>Email
            </li>
            <li>
               <i class="fa fa-mobile"></i> SMS
            </li>
            <li>
                <i class="fas fa-file"></i>File Upload
            </li>
            <li>
                <i class="fas fa-chart-bar"></i>Report
            </li>
            <li>
                <i class="fas fa-exclamation"></i>Notification
            </li>
            <li>
                <i class="fas fa-user-tag"></i>Role Permission
            </li>
        </ul>
      <div class="panel panel-default pb-0 tab-content bgImage" v-bind:style="{ 'background-image': 'url(' + auditLogBackgroundImage + ')' }">
        <div class="text-left mt-4"><h4>Audit Log</h4></div>
        <div class="panel-body text-left" >
          <p class="backdrop p-l-10 col-12 col-sm-6">
         "An audit trail (also called audit log) is a security-relevant chronological record, set of records,
          and/or destination and source of records that provide documentary evidence of the sequence of activities
          that have affected at any time a specific operation, procedure, or event". 

          The Portal helps to register Auditlog for any application  and generate Auditlog reports as required.         
          </p>
          <div class="pb-10">
           <router-link class="k-button k-primary mr-10" to="/home/applications">Start</router-link> 
           <button id="auditLogDocBtn" class="k-button k-primary" @click="downloadDocument">Document for Restful API Integration</button>
           </div>
        </div>
      </div>
      <div class="panel panel-defaultpb-0 tab-content bgImage" v-bind:style="{ 'background-image': 'url(' + emailBackgroundImage + ')'}">
        <div class="text-left mt-5"><h4>Email</h4></div>
        <div class="panel-body text-left">
          <p class="backdrop p-l-10 col-12 col-sm-6">
          Email sending based on different Clients and Tenants using different respective Email provider has become a complex management.
          The tool helps in managing different Email providers for tenants with respective channel creation and registration.
          Also keeps record of all Email sent in respective channels.    
          </p>   
           <div class="pb-10"> 
          <router-link class="k-button k-primary mr-10" to="/home/emailpools">Start</router-link> 
          <button id="emailDocBtn" class="k-button k-primary" @click="downloadDocument">Document for Restful API Integration</button> 
           </div>  
        </div>
      </div>
      <div class="panel panel-default pb-0 tab-content bgImage" v-bind:style="{ 'background-image': 'url(' + smsBackgroundImage + ')'}">
        <div class="text-left mt-5"><h4>SMS</h4></div>
        <div class="panel-body text-left">
          <p class="backdrop p-l-10 col-12 col-sm-6" >
          SMS sending based on different Clients and Tenants using different respective SMS provider has become a complex management.
          The tool helps in managing different SMS providers for tenants with respective channel creation and registration.
          Also keeps record of all SMS sent in respective channels.      
          </p>   
          <div class="pb-10">     
          <router-link class="k-button k-primary mr-10" to="/home/smspools">Start</router-link>
          <button id="smsDocBtn" class="k-button k-primary" @click="downloadDocument">Document for Restful API Integration</button>
          </div>
        </div>
        </div>
        <div class="panel panel-default pb-0 tab-content bgImage" v-bind:style="{ 'background-image': 'url(' + fileUploadBackgroundImage + ')'}">
        <div class="text-left mt-5"><h4>File Upload</h4></div>
        <div class="panel-body text-left">
          <p class="backdrop p-l-10 col-12 col-sm-6">
          File Upload to cloud Platforms such as DigitalOcean, AWS and Azure has made it easy to upload multiple files and manage the same. 

          Just registering the application and create a channel with provider configuration will allow easy upload, view and maintain the histories of file.    
          </p>     
          <div class="pb-10">
          <router-link class="k-button k-primary  mr-10" to="/home/filepools">Start</router-link>  
          <button id="fileDocBtn" class="k-button k-primary" @click="downloadDocument">Document for Restful API Integration</button>  
          </div>  
        </div>
        </div>
        <div class="panel panel-default pb-0 tab-content bgImage" v-bind:style="{ 'background-image': 'url(' + reportBackgroundImage + ')'}">
        <div class="text-left mt-5"><h4>Report</h4></div>
        <div class="panel-body text-left">
          <p class="backdrop p-l-10 col-12 col-sm-6">
          Report service can be used to store and retrieve report data from the database. The tool can be used to register an application and save to a mongoDB or postgresql
          repository as per the configuration. (Currently only mongoDB supported for now)

           The Portal helps to register Report services for any application and generate reports as required. 
          </p>     
          <div class="pb-10">
          <router-link class="k-button k-primary  mr-10" to="/home/reportGenerationpools">Start</router-link>  
          <button id="reportDocBtn" class="k-button k-primary" @click="downloadDocument">Document for Restful API Integration</button>  
          </div>  
        </div>
        </div>
        <div class="panel panel-default pb-0 tab-content bgImage" v-bind:style="{ 'background-image': 'url(' + notificationBackgroundImage + ')'}">
        <div class="text-left mt-5"><h4>Notification</h4></div>
        <div class="panel-body text-left">
          <p class="backdrop p-l-10 col-12 col-sm-6">
          Report service can be used to store and retrieve notifications from the database.

           The Portal helps to register Notification services for any application and store notification messages as required. 
          </p>     
          <div class="pb-10">
          <router-link class="k-button k-primary  mr-10" to="/home/notificationapplications">Start</router-link>  
          <button id="notificationBtn" class="k-button k-primary" @click="downloadDocument">Document for Restful API Integration</button>  
          </div>  
        </div>
        </div>
        <div class="panel panel-default pb-0 tab-content bgImage" v-bind:style="{ 'background-image': 'url(' + rolePermissionBackgroundImage + ')'}">
        <div class="text-left mt-5"><h4>Role Permission</h4></div>
        <div class="panel-body text-left">
          <p class="backdrop p-l-10 col-12 col-sm-6">
          Role Permission service can be used to store and retrieve permissions and the roles that have those permissions from the database. The tool can be used to register an application 
          and save permissions and role permission mappings.

           The Portal helps to register Role Permission services for any application and save permissions and role permissions mappings as required. 
          </p>     
          <div class="pb-10">
          <router-link class="k-button k-primary  mr-10" to="/home/rolePermissionApplications">Start</router-link>  
          <button id="rolePermissionBtn" class="k-button k-primary" @click="downloadDocument">Document for Restful API Integration</button>  
          </div>  
        </div>
        </div>
       </kendo-tabstrip>
      </div>
    </div>
</template>

<script>
import '@progress/kendo-ui/js/kendo.tabstrip'
import { TabStrip } from '@progress/kendo-layout-vue-wrapper'
import axios from "axios"
export default {
  name: "LandingPage",
  data(){
    return {
      auditLogBackgroundImage: require("../assets/images/AuditLogBg.png"),
      emailBackgroundImage: require("../assets/images/emailBg2.jpg"),
      smsBackgroundImage: require("../assets/images/smsBg.jpg"),
      fileUploadBackgroundImage: require("../assets/images/fileUploadBg.jpg"),
      reportBackgroundImage: require("../assets/images/ReportBg.png"),
      notificationBackgroundImage: require("../assets/images/NotificationBg.jpg"),
      rolePermissionBackgroundImage: require("../assets/images/rolepermissionBg.png")
    };
  },
   components: {
    'kendo-tabstrip': TabStrip
  },
  beforeMount(){
  },
  methods:{    
    async downloadDocument(e){
      var btnID = e.currentTarget.id;
      var apiUrl, downloadUrl;
      switch(btnID){
        case "auditLogDocBtn":
          apiUrl = this.$config.auditLogApiManagementUrl
          break;
        case "emailDocBtn":
          apiUrl = this.$config.emailApiManagementUrl
          break;
        case "smsDocBtn":
          apiUrl = this.$config.smsApiManagementUrl
          break;
        case "fileDocBtn":
          apiUrl = this.$config.fileApiManagementUrl
          break;
        case "reportDocBtn":
          apiUrl = this.$config.reportApiManagementUrl
          break;
        case "notificationBtn":
          apiUrl = this.$config.notificationApiManagementUrl
          break;
        case "rolePermissionBtn":
          apiUrl = this.$config.rolePermissionApiManagementUrl
          break;
        default:
            apiUrl = null;
            break;
      }
      if(apiUrl != null){
      const response = await axios.get(apiUrl + "GetApiDocumentUrl");
      if(response.data.result != null){
        downloadUrl = response.data.result;
      }
      if(downloadUrl){
      var link = document.createElement("a");
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link = null;
      }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bgImage{
background-size:cover;
background-repeat:no-repeat;
background-position: center;
height:70vh!important;
}
.backdrop{
      backdrop-filter: brightness(0.4);
      color:white;
      font-style: italic;
}
.row {
  overflow: auto;
  height: 65vh;
}
.jumbotron {
  margin-bottom: 0;
}
h3 {
  margin: 10px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #0d1b15;
}
.card-header {
  background: #303f9f;
}

.card-body span {
  font-weight: 600;
  color: #303f9f;
}

.p-l-10{
  padding-left: 10px;
}

.pb-10{
  padding-bottom: 10px;
}

.mt-2{
  margin-top: -1rem!important;
}

.tab-content{
color: black;
}



a:link.downloadLink {
  color: #0d1b15;
  text-decoration: underline;
}
a:hover.downloadLink {
  color: rgb(255, 255, 255);
  text-decoration: underline;
}

p{
  font-size: 20px;
}

.mt-100{
  margin-top: 100px;
}

.mt-50{
  margin-top: 50px;
}

.mt-75{
  margin-top: 75px
}
</style>
