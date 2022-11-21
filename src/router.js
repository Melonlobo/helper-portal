import Vue from 'vue'
import Router from 'vue-router'
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc'
import store from './services/store'
import Nprogress from 'nprogress'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base:'',// process.env.BASE_URL,
  routes: [    
    {
      path: '/',
      name: 'Loader',
      component:()=>import('./components/Loader'),
      },
      {
      path: '/home',
      name: 'home',
      component:()=>import('./views/Home'),
      meta: {
        isPublic:false,
        requiresAuth: true
      },
      children:[
        {
          path: "applications",
          name: 'Applications',
          component:()=>import('./views/AuditLog/Applications.vue'),
          meta: {
            title: 'Applications'
          }
        },
        {
          path: "auditentities",
          name: 'AuditEntities',
          component:()=>import('./views/AuditLog/AuditEntities.vue'),
          meta: {
            title: 'Audit Entities'
          }
        },
        {
          path: "auditlogs",
          name: 'AuditLogs',
          component:()=>import('./views/AuditLog/AuditLogs.vue'),
          meta: {
            title: 'Audit Logs'
          }
        },
        {
          path: "emailpools",
          name: 'EmailPool',
          component:()=>import('./views/Email/EmailPools.vue'),
          meta: {
            title: 'Email Pools'
          }
        },{
          path: "emailproviders",
          name: 'EmailProviders',
          component:()=>import('./views/Email/EmailProviders.vue'),
          meta: {
            title: 'Email Providers'
          }
        },
        {
          path: "emailchannels",
          name: 'EmailChannel',
          component:()=>import('./views/Email/EmailChannels.vue'),
          meta: {
            title: 'Email Channels'
          }
        },
        {
          path: "emailtemplates",
          name: 'EmailTemplate',
          component:()=>import('./views/Email/EmailTemplates.vue'),
          meta: {
            title: 'Email Templates'
          }
        },
        {
          path: "emailQuotas",
          name: 'emailQuotas',
          component:()=>import('./views/Email/EmailQuotas.vue'),
          meta: {
            title: 'Email Quotas'
          }
        },
        {
          path: "emailhistories",
          name: 'EmailHistories',
          component:()=>import('./views/Email/EmailHistories.vue'),
          meta: {
            title: 'Email Histories'
          }
        },
        {
          path: "smspools",
          name: 'SMSPool',
          component:()=>import('./views/SMS/SMSPools.vue'),
          meta: {
            title: 'SMS Pools'
          }
        },{
          path: "smsproviders",
          name: 'SMSProviders',
          component:()=>import('./views/SMS/SMSProviders.vue'),
          meta: {
            title: 'SMS Providers'
          }
        },
        {
          path: "smschannels",
          name: 'SMSChannel',
          component:()=>import('./views/SMS/SMSChannels.vue'),
          meta: {
            title: 'SMS Channels'
          }
        },
        {
          path: "smstemplates",
          name: 'SMSTemplate',
          component:()=>import('./views/SMS/SMSTemplates.vue'),
          meta: {
            title: 'SMS Templates'
          }
        },
        {
          path: "smsquotas",
          name: 'SMSQuotas',
          component:()=>import('./views/SMS/SMSQuotas.vue'),
          meta: {
            title: 'SMS Quotas'
          }
        },
        {
          path: "smshistories",
          name: 'SMSHistories',
          component:()=>import('./views/SMS/SMSHistories.vue'),
          meta: {
            title: 'SMS Histories'
          }
        },
        {
          path: "filepools",
          name: 'FilePool',
          component:()=>import('./views/FileUpload/FilePools.vue'),
          meta: {
            title: 'File Pools'
          }
        },{
          path: "fileproviders",
          name: 'FileProviders',
          component:()=>import('./views/FileUpload/FileProviders.vue'),
          meta: {
            title: 'File Providers'
          }
        },
        {
          path: "filechannels",
          name: 'FileChannel',
          component:()=>import('./views/FileUpload/FileChannels.vue'),
          meta: {
            title: 'File Channels'
          }
        },
        {
          path: "filehistories",
          name: 'FileHistories',
          component:()=>import('./views/FileUpload/FileHistories.vue'),
          meta: {
            title: 'File Histories'
          }
        },
        {
          path: "sendemail",
          name: 'EmailSend',
          component:()=>import('./views/Email/SendEmail.vue'),
          meta: {
            title: 'Send Sample Email'
          }
        },
        {
          path: "sendsms",
          name: 'SMSSend',
          component:()=>import('./views/SMS/SendSMS.vue'),
          meta: {
            title: 'Send Sample SMS'
          }
        },
        {
          path: "uploadfile",
          name: 'UploadFile',
          component:()=>import('./views/FileUpload/UploadFile.vue'),
          meta: {
            title: 'Upload Sample File'
          }
        }, 
        {
          path: "reportpools",
          name: 'ReportPool',
          component:()=>import('./views/ReportGeneration/ReportGenerationPools.vue'),
          meta: {
            title: 'Report Generation Pools'
          }
        },
        {
          path: "reportProviders",
          name: 'ReportProvider',
          component:()=>import('./views/ReportGeneration/ReportGenerationProviders.vue'),
          meta: {
            title: 'Report Generation Providers'
          }
        },
        {
          path: "reportChannels",
          name: 'ReportChannel',
          component:()=>import('./views/ReportGeneration/ReportGenerationChannels.vue'),
          meta: {
            title: 'Report Generation Channels'
          }
        },
        {
          path: "reportHistories",
          name: 'ReportHistory',
          component:()=>import('./views/ReportGeneration/ReportGenerationHistories.vue'),
          meta: {
            title: 'Report Generation Histories'
          }
        },
        {
          path: "insertReportData",
          name: 'InsertReportData',
          component:()=>import('./views/ReportGeneration/InsertReportData.vue'),
          meta: {
            title: 'Insert Report Data'
          }
        },
        {
          path: "generateReportData",
          name: 'GenerateReportData',
          component:()=>import('./views/ReportGeneration/GenerateReportData.vue'),
          meta: {
            title: 'Generate Report Data'
          }
        },
        {
          path: "notificationApplications",
          name: 'notificationApplications',
          component:()=>import('./views/Notification/NotificationApplications.vue'),
          meta: {
            title: 'Notification Application'
          }
        },
        {
          path: "notificationChannels",
          name: 'notificationChannels',
          component:()=>import('./views/Notification/NotificationChannels.vue'),
          meta: {
            title: 'Notification Channel'
          }
        },        
        {
          path: "createNotification",
          name: 'createNotification',
          component:()=>import('./views/Notification/CreateNotification.vue'),
          meta: {
            title: 'Create Notification'
          }
        },
        {
          path: "notifications",
          name: 'notifications',
          component:()=>import('./views/Notification/Notifications.vue'),
          meta: {
            title: 'Notifications'
          }
        },
          {
            path: "firebaseDevices",
            name: 'firebaseDevices',
            component:()=>import('./views/Notification/FirebaseDevices.vue'),
            meta: {
              title: 'Firebase Devices'
            }
        },
        {
          path: "rolePermissionApplications",
          name: 'rolePermissionApplications',
          component:()=>import('./views/RolePermission/RolePermissionApplications.vue'),
          meta: {
            title: 'Role Permission Application'
          }
        },
        {
          path: "rolePermissionChannels",
          name: 'rolePermissionChannels',
          component:()=>import('./views/RolePermission/RolePermissionChannels.vue'),
          meta: {
            title: 'Role Permission Channels'
          }
        },
        {
          path: "Permissions",
          name: 'rolePermissions',
          component:()=>import('./views/RolePermission/Permissions.vue'),
          meta: {
            title: 'Permission'
          }
        },{
          path: "RolePermissionMapping",
          name: 'rolePermissionMapping',
          component:()=>import('./views/RolePermission/RolePermissionMapping.vue'),
          meta: {
            title: 'Role Permission Mapping'
          }
        },
        // ,{
        //   path: "role-claims",
        //   name: 'RoleClaims',
        //   component: ()=>import('./views/RoleClaims/RoleClaims'),
        //   meta: {
        //     requiresAuth: true,
        //     title: 'Role Claims'
        //   },
        // },{
        //   path: "view-roles",
        //   name: 'ViewRoles',
        //   component: ()=>import('./views/Roles/ViewRoles'),
        //   meta: {
        //     requiresAuth: true,
        //     title: 'View Roles'
        //   }
        // },{
        //   path: "identity-pool",
        //   name: 'IdentityPool',
        //   component: ()=>import('./views/IdentityPool/IdentityPool'),
        //   meta: {
        //     requiresAuth: true,
        //     title: 'Identity Pool'
        //   }
        // },
        // {
        //   path: "view-tenants",
        //   name: 'Tenants',
        //   component: ()=>import('./views/Tenants/Tenants'),
        //   meta: {
        //     requiresAuth: true,
        //     title: 'Tenant Management'
        //   }
        // },
        // {
        //   path: "view-clients",
        //   name: 'Clients',
        //   component: ()=>import('./views/Clients/Clients'),
        //   meta: {
        //     requiresAuth: true,
        //     title: 'Client Management'
        //   }
        // },
        {
          path: "*",
          name: 'LandingPage',
          component:()=>import('./components/Home') ,
          meta: {
            requiresAuth: true,
            title: 'Home Page'
          }
        },
      ]
    },
    {
      path: '/login',
      name:"login",
      meta: {
        requiresAuth: true
      },
      component: ()=>import('./views/LoginLoad'),
    },
    {
      path: '/callback1',
      name: 'callback',
      meta: {
        requiresAuth: true
      },
      component: ()=>import('./views/Callback'),
    },
    {
      path: '/silent-renew-oidc', // Needs to match redirectUri (redirect_uri if you use snake case) in you oidcSettings
      name: 'oidcSilentRenew',
      component: ()=>import('./components/OidcSilentRenewal'),
      meta: { title: 'oidcSilentRenew', isPublic: true }

    },{
      path: '/callback', // Needs to match redirectUri (redirect_uri if you use snake case) in you oidcSettings
      name: 'oidcCallback',
      component: ()=>import('./views/OidcCallback'),
      meta: { title: 'Login', isPublic: true }
    },
    {
      path: '/logoutSuccess',
      name: 'Logout',
      component: ()=>import('@/components/LogoutSuccess.vue'),
      meta: {  title: 'Logout', isPublic: true }
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: ()=>import('./views/Unauthorized')
    },
  ]
})

export default router;


// router.beforeEach(async (to, from, next) => {
// //  setTimeout(function(){
// console.log(next);
//   let app = router.app.$data || {isAuthenticated: false}
  
//   if (app.isAuthenticated) {
//     //already signed in, we can navigate anywhere
//     console.log("isAuthenticated");
//     next()
//   } else if (to.matched.some(record => record.meta.requiresAuth)) {
//     // authentication is required. Trigger the sign in process, including the return URI
//     let authenticate = router.app.authenticate
//     debugger
//     console.log("Navigate to login");
//     if(authenticate!=undefined){
//       authenticate(to.path).then(() => {
//         console.log('authenticating a protected url:' + to.path);
//         next()
//       });
//     // next("")
//     }
//     else 
//     next("/")

//   }
//    else {
     
//     console.log("NO auth required");
//     //No auth required. We can navigate
//     next()
//   }
// //  },2000);
// });



router.beforeEach(vuexOidcCreateRouterMiddleware(store))


router.beforeResolve((to, from, next) => {
  if (to.name) {
    Nprogress.start()
  }
  next()
});

router.afterEach(() => {
  Nprogress.done()
});