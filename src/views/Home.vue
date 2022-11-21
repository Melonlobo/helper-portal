<template>
  <div class="home">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div>
        <a class="navbar-brand m-xs-auto" href="#">
        <img
          src="../assets/images/NovigoLogo.png"
          width="auto"
          height="35"
          class="d-inline-block align-top"
          alt=""
          style="background: white; border-radius: 5px; padding: 4px"
        />
        <!-- <h5 class="d-none d-sm-inline ml-2" style="line-height: 1.8">
          Identity Portal Management
        </h5> -->
        </a>
      <button class="dashboard-icon" @click="openSideBar">
        <i class="fas fa-bars"></i>
      </button>
      
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav ml-auto mt-2 mt-lg-0 my-lg-0">
          <!-- <li class="nav-item active">
            <router-link class="nav-link" to="/home/">Home</router-link>
          </li> -->

          <li class="nav-item active">
            <!--<router-link class="nav-link" @click.native="logout" to="/"
              >Log Out <i class="fas fa-sign-out-alt"></i>
            </router-link> -->
            <button
              class="btn bg-transparent text-black btn-submit d-block"
              @click="signOut"
            >
              Logout <i class="fas fa-sign-out-alt"></i>
            </button>
          </li>

          <!-- <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Account
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Settings</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Log Out</a>
            </div>
          </li> -->
        </ul>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row" style="flex-wrap: nowrap">
        <div
          class="dashboard "
          style="width: 250px"
          id="mySidebar"
        >
          <!-- <button class="dash-item" @click="openSideBar">Close &times;</button> -->
          <!-- <h5>Select Identity Pool</h5>
          <dropdownlist
            :data-items="identityPools"
            :text-field="'name'"
            :data-item-key="'id'"
            @change="onSelectIdentity"
          >
          </dropdownlist>
           -->
          
          <ul class="nav d-block">
            <li class="nav-item">
              <router-link class="nav-link text-truncate" to="/home/"
                ><i class="fa fa-home"></i>
                <span class="d-block d-md-inline">Home</span></router-link
              >
            </li>  
            <li class="nav-item">
              <a
                class="nav-link collapsed text-truncate"
                href="#submenu1"
                data-toggle="collapse"
                data-target="#submenu1"
                ><i class="fas fa-book"></i>
                <span
                  ><a class="nav-link d-block d-md-inline p-0" to=""
                    >Audit Logs
                  </a></span
                ></a
              >
              <div class="collapse" id="submenu1" aria-expanded="false">
                <ul class="flex-column pl-4 nav">
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/applications"
                        ><i class="fas fa-plus"></i>
                        Applications
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/auditentities">
                        <i class="fas fa-language"></i> Audit Entities
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/auditlogs">
                        <i class="fas fa-history"></i> Audit Reports
                      </router-link></a
                    >
                  </li>
                </ul>
              </div>
            </li>
             <li class="nav-item">
              <a
                class="nav-link collapsed text-truncate"
                href="#submenu2"
                data-toggle="collapse"
                data-target="#submenu2"
                ><i class="fas fa-envelope"></i>
                <span
                  ><a class="nav-link d-block d-md-inline p-0" to=""
                    >Email
                  </a></span
                ></a
              >
              <div class="collapse" id="submenu2" aria-expanded="false">
                <ul class="flex-column pl-4 nav">
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/emailpools"
                        ><i class="fas fa-plus"></i>
                        Email Pools
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/emailproviders">
                        <i class="fas fa-server"></i> Email Providers
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/emailchannels">
                        <i class="fas fa-signal"></i> Email Channels
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/emailtemplates">
                        <i class="fas fa-id-card"></i> Email Templates
                      </router-link></a
                    >
                  </li>
                   <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/emailquotas">
                        <i class="fas fa-balance-scale"></i> Email Quotas
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/emailhistories">
                        <i class="fas fa-history"></i> Email Histories
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/sendemail">
                        <i class="fas fa-upload"></i> Send Email
                      </router-link></a
                    >
                  </li>
                </ul> 
              </div>
            </li>
             <li class="nav-item">
              <a
                class="nav-link collapsed text-truncate"
                href="#submenu3"
                data-toggle="collapse"
                data-target="#submenu3"
                ><i class="fa fa-mobile"></i>
                <span
                  ><a class="nav-link d-block d-md-inline p-0" to=""
                    >SMS
                  </a></span
                ></a
              >
              <div class="collapse" id="submenu3" aria-expanded="false">
                <ul class="flex-column pl-4 nav">
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/smspools"
                        ><i class="fas fa-plus"></i>
                        SMS Pools
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/smsproviders">
                        <i class="fas fa-server"></i> SMS Providers
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/smschannels">
                        <i class="fas fa-signal"></i> SMS Channels
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/smstemplates">
                        <i class="fas fa-id-card"></i> SMS Templates
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/smsquotas">
                        <i class="fas fa-balance-scale"></i> SMS Quotas
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/smshistories">
                        <i class="fas fa-history"></i> SMS Histories
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/sendsms">
                        <i class="fas fa-upload"></i> Send SMS
                      </router-link></a
                    >
                  </li>
                </ul> 
              </div>
            </li>
             <li class="nav-item">
              <a
                class="nav-link collapsed text-truncate"
                href="#submenu4"
                data-toggle="collapse"
                data-target="#submenu4"
                ><i class="fas fa-file"></i>
                <span
                  ><a class="nav-link d-block d-md-inline p-0" to=""
                    >File Upload
                  </a></span
                ></a
              >
              <div class="collapse" id="submenu4" aria-expanded="false">
                <ul class="flex-column pl-4 nav">
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/filepools"
                        ><i class="fas fa-plus"></i>
                        File Pools
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/fileproviders">
                        <i class="fas fa-server"></i> File Providers
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/filechannels">
                        <i class="fas fa-signal"></i> File Channels
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/filehistories">
                        <i class="fas fa-history"></i> File Histories
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/uploadfile">
                        <i class="fas fa-file-upload"></i> Upload File
                      </router-link></a
                    >
                  </li>
                </ul> 
              </div>
            </li>
            <li class="nav-item">
              <a
                class="nav-link collapsed text-truncate"
                href="#submenu4"
                data-toggle="collapse"
                data-target="#submenu5"
                ><i class="fas fa-chart-bar"></i>
                <span
                  ><a class="nav-link d-block d-md-inline p-0" to=""
                    >Report
                  </a></span
                ></a
              >
              <div class="collapse" id="submenu5" aria-expanded="false">
                <ul class="flex-column pl-4 nav">
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/reportPools"
                        ><i class="fas fa-plus"></i>
                        Report Pools
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/reportProviders">
                        <i class="fas fa-server"></i> Report Providers
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/reportChannels">
                        <i class="fas fa-signal"></i> Report Channels
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/reportHistories">
                        <i class="fas fa-history"></i> Report Histories
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/insertReportData">
                        <i class="fas fa-upload"></i> Insert Report Data
                      </router-link></a
                    >
                  </li>
                   <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/generateReportData">
                        <i class="fas fa-briefcase"></i> Generate Report Data
                      </router-link></a
                    >
                  </li>
                </ul> 
              </div>
            </li>
            <li class="nav-item">
              <a
                class="nav-link collapsed text-truncate"
                href="#submenu4"
                data-toggle="collapse"
                data-target="#submenu6"
                ><i class="fas fa-exclamation"></i>
                <span
                  ><a class="nav-link d-block d-md-inline p-0" to=""
                    >Notification
                  </a></span
                ></a
              >
              <div class="collapse" id="submenu6" aria-expanded="false">
                <ul class="flex-column pl-4 nav">
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/notificationApplications"
                        ><i class="fas fa-plus"></i>
                        Notification Applications
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/notificationChannels">
                        <i class="fas fa-signal"></i> Notification Channels
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/createNotification">
                        <i class="fas fa-upload"></i> Create Notification
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/notifications">
                        <i class="fas fa-history"></i> Notifications
                      </router-link></a
                    >
                  </li>
                   <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/firebaseDevices">
                        <i class="fas fa-mobile"></i> Firebase Devices
                      </router-link></a
                    >
                  </li>
                </ul> 
              </div>
            </li>
             <li class="nav-item">
              <a
                class="nav-link collapsed text-truncate"
                href="#submenu4"
                data-toggle="collapse"
                data-target="#submenu7"
                ><i class="fas fa-user-tag"></i>
                <span
                  ><a class="nav-link d-block d-md-inline p-0" to=""
                    >Role Permission
                  </a></span
                ></a
              >
              <div class="collapse" id="submenu7" aria-expanded="false">
                <ul class="flex-column pl-4 nav">
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/rolePermissionApplications"
                        ><i class="fas fa-plus"></i>
                        Role Permission Applications
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/rolePermissionChannels"
                        ><i class="fas fa-signal"></i>
                        Role Permission Channels
                      </router-link></a
                    >
                  </li>
                   <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/Permissions">
                        <i class="fas fa-upload"></i> Permissions
                      </router-link></a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="#">
                      <router-link class="nav-link" to="/home/rolePermissionMapping"
                        ><i class="fas fa-project-diagram"></i>
                        Role Permission Mapping
                      </router-link></a
                    >
                  </li>
                </ul> 
              </div>
            </li>
          </ul>
        </div>

        <div class="col px-0 pt-1 content" style="overflow-x:auto">
          <div class="mainContent">
            <router-view />
          </div>
        </div>
      </div>
    </div>

    <footer class="pull-left footer">
      <hr class="divider mb-0" />
      Copyright &COPY; 2021
      <a href="http://www.novigosolutions.com">Novigo Solutions</a>
    </footer>
  </div>
</template>
<style >

td{
  border:0!important;
  padding:0.4rem !important;
}
.dashboard-icon {
  background: transparent;
  padding: 5px;
  border: none;
  outline: none;
  font-size: 20px;
  color: #777;
}
.dashboard-icon:focus{
  outline: none;
}

.dashboard-icon:hover{
  color: black;
}
.navbar {
  background: #fff;
  border-bottom: 1px solid #e0e4e9;
  border-radius: 0 0 5px 5px;
}
.sidebar-button {
  color: rgba(0, 0, 0, 0.5);
  border-color: rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  line-height: 1;
  background-color: transparent;
  border-radius: 0.25rem;
}
.navbar-toggler {
  font-size: 0.75rem;
}
.dashboard {
  height: 80vh;
  width: 200px;
  background-color: #fff;
  position: relative;
  z-index: 1;
  overflow: auto;
  display: none;
  padding: 8px 16px;
  text-align: left;
  border-right:1px solid #e0e4e9;
  white-space: normal;
  float: none;
  outline: 0;
  animation: animateleft 0.4s;
}
@keyframes animateleft {
  from {
    left: -300px;
    opacity: 0;
  }
  to {
    left: 0;
    opacity: 1;
  }
}
.dash-item {
  padding: 8px 16px;
  float: left;
  width: auto;
  border: none;
  display: block;
  outline: 0;
  font-size: 1rem;
  width: 100%;
}
.fa,
.fas {
  padding-right: 0.75rem;
}
.nav-link {
  color:rgba(0,0,0,.7);
  font-weight: 500;
  white-space: normal;
  word-break: break-word;
}
.k-widget.k-dialog {
    overflow: auto;
}

.sm-font{
  font-size: 14px;
}

.k-button{
  padding: 0.275rem 0.5rem;
  font-size: 14px;
}

@media only screen and (max-width: 1024px) {
  .dashboard{
    position:fixed;
    z-index: 99;
  }
  
}
</style>
<script>
// @ is an alias to /src
import Home from "@/components/Home.vue";
import { mapActions } from "vuex";
import axios from "axios";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { oidcSettings } from "../services/store";
export default {
  name: "home",
  components: {
    Home,   
    dropdownlist: DropDownList,

  },
  data: function () {
    return {
      base_url: undefined,
      identityPools: [],
      selectedIdentity: undefined,
      }
    },
  mounted: function () {
    this.base_url = oidcSettings.authority + "/api/IdentityManagement/";

    //this.getIdentityPools();
  },
  methods: {
    ...mapActions(["authenticateOidcPopup", "signOutOidcSilent"]),
    openSideBar() {
      if (document.getElementById("mySidebar").style.display == "block") {
        document.getElementById("mySidebar").style.display = "none";
      } else {
        document.getElementById("mySidebar").style.display = "block";
      }
    },
    signOut: function () {
      this.signOutOidcSilent().then((response) => {
        this.$router.push("/logoutSuccess");
      });
    },
  },
};
</script>
