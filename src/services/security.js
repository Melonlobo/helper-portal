import Oidc from "oidc-client";

var defaultTenant = "master";
var tenant = "";
var url = new URL(window.origin);
var host = url.hostname;
// if(host == "localhost")
//     tenant = defaultTenant;
// else
//     tenant = host.split('.')[0];

var mgr = new Oidc.UserManager({
  //   acr_values: "tenant:helper-portal-email", //+ tenant,
  //   authority: "http://localhost:5000/",
  authority:
    "https://login.microsoftonline.com/ceadaba2-651a-4e69-b798-33eb63625291/v2.0/.well-known/openid-configuration",
  //"redirect_uri":"http://identity.novigodemo.com/callback",
  redirect_uri: window.location.origin + "/callback", //window.location.origin+"/callback", //"http://localhost:8080/callback",
  client_id: "25e86c18-592e-47b8-a218-629d24d213a0", //"localhost.app",
  grant_type: "authorization_code",
  client_secret: "4aafb305-c0c7-483b-a890-ae0a80f099af",
  response_type: "code",
  scope:
    "https://helperportal.onmicrosoft.com/25e86c18-592e-47b8-a218-629d24d213a0/helperPortal",
  post_logout_redirect_uri: window.location.origin + "/logoutSuccess", //"http://localhost:8080/logoutSuccess",
  silent_redirect_uri: "${window.location.origin}/silent-renew.html",
  automaticSilentRenew: true,
  userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
});
// Oidc.Log.logger = console;
// Oidc.Log.level = Oidc.Log.INFO;

// mgr.events.addUserLoaded(async function (user) {
//   await store.dispatch('refreshUserInfo');
//   await store.dispatch('ensureUserIsKnown');
// });

// mgr.events.addAccessTokenExpiring(function () {
//   // console.log('AccessToken Expiring：', arguments);
// });

// mgr.events.addAccessTokenExpired(function () {
//   mgr.signoutRedirect().then(function (resp) {
//     store.commit('set_user', null); //clear user details in vuex
//   }).catch(function (err) {
//     console.log(err)
//   })
// });

// mgr.events.addSilentRenewError(function () {
//   console.error('Silent Renew Error：', arguments);
// });

// mgr.events.addUserSignedOut(function () {
//   mgr.signoutRedirect().then(function (resp) {
//     store.commit('set_user', null); //clear user details in vuex
//   }).catch(function (err) {
//     console.log(err)
//   })
// });

// class SecurityService {

//   constructor(){
//     // console.log('Creating SecurityService instance')
//   }

//   async getUser () {
//     let self = this;
//     return new Promise((resolve, reject) => {
//       mgr.getUser().then(function (user) {
//         if (user == null) {
//           return resolve(null)
//         } else {
//           return resolve(user)
//         }
//       }).catch(function (err) {
//         console.log(err)
//         return reject(err)
//       });
//     })
//   }

//   signIn (returnToUrl) {
//     returnToUrl ? mgr.signinRedirect({ state: returnToUrl })
//         : mgr.signinRedirect();
//   }

//   signOut () {
//     var self = this;
//     mgr.signoutRedirect().then(function (resp) {
//       // console.log('signed out', resp);
//     }).catch(function (err) {
//       console.log(err)
//     })
//   }
// }

// let service = new SecurityService();

// export {service as default, mgr};

export default mgr;
