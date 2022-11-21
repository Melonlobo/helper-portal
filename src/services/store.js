import { vuexOidcCreateStoreModule } from "vuex-oidc";
import Vuex from "vuex";
import Vue from "vue";

export const oidcSettings = {
  //"acr_values" : "tenant: isOTPLogin:false",//+ tenant,

  //"authority": 'https://nvg-identityserver.conveyor.cloud/',
  //"authority":'https://api.testtracker.xyz/identity',
  //"client_id":"vts-mobile.app",
  // ---------------------- Netlify credentials prod start---------------------
  // "authority":"https://apiv2.trackervigil.com/identity",
  //  "client_id":"netlify.helperservice.app",
  // "client_secret":"34a01845-f122-4b58-90e8-a7761d3187bd",
  // ---------------------- Netlify credentials end---------------------
  // ---------------------- Netlify credentials LT start---------------------
  authority:
    "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
  //"client_id":"netlify.helperservicelt.app", //- for LT
  client_id: "25e86c18-592e-47b8-a218-629d24d213a0", // - for LOCAL
  client_secret: "4aafb305-c0c7-483b-a890-ae0a80f099af",
  client_name: "helperPortal",
  // ---------------------- Netlify credentials end---------------------
  // ---------------------- Netlify credentials Staging start---------------------
  //"authority":"https://api.trackervigil.in/identity",
  //"client_id":"netlify.helperservicelt.app", //- for LT
  //"client_id":"helperservicest.app", // - for LOCAL
  //"client_secret":"34a01845-f122-4b58-90e8-a7761d3187bd",
  //"client_name":"Vue JS APP for Helper Service Staging",
  // ---------------------- Netlify credentials staging end---------------------

  //  "client_id": "commonhelperservicesportallocal.app",
  //"client_id":"commonhelperserviceportal.app",
  //  "client_secret":"52130d7b-71d3-4dba-9180-c442201497f6",
  // ---------------------- localhost credentials start---------------------
  // "authority": 'https://localhost:5002',
  //  "client_id": "localhost.app",
  //  "client_secret":"ea6a4bce-64f9-4d48-b4c0-fd79f7f2df95",
  // ---------------------- localhost credentials end---------------------
  // ---------------------- Netlify test tracker credentials start---------------------
  // "authority":"https://api.testtracker.xyz/identity",
  // "client_id":"netlify.helperservicett.app",
  // "client_secret":"34a01845-f122-4b58-90e8-a7761d3187bd",
  // "client_name":"Vue JS APP for Helper Service tt",
  // ---------------------- Netlify  test tracker credentials end---------------------
  //"client_id": "commonhelperservicesportallocal.app",
  //"client_secret":"52130d7b-71d3-4dba-9180-c442201497f6",
  //"authority":"https://api.novigodemo.com",
  //"authority":"http://identityapi.novigodemo.com",
  // "authority":"https://api.vts-dev.xyz/identity",
  //"client_id": "novigoidentityportal.app",//"localhost.app", //"novigoidentityportal.app", //"ETMS.app",
  //"client_secret": "a2cc8529-889a-48b0-af66-a145423ed572",//"0b4168e4-2832-48ea-8fc8-7e4686b3620b",
  //"redirect_uri": "http://identitymanager.novigodemo.com/callback",
  redirect_uri: window.location.origin + "/callback", //window.location.origin+"/callback", //"http://localhost:8080/callback",
  //"client_name":"Vue JS APP for Helper Service nd",
  //"client_name":"Vue JS APP for Helper Service Local",
  grant_type: "authorization_code",
  response_type: "code",
  scope: "openid profile",
  //"post_logout_redirect_uri": "http://identitymanager.novigodemo.com/logoutSuccess",
  //"silent_redirect_uri": 'http://identitymanager.novigodemo.com/silent-renew-oidc',//'http://identity.novigodemo.com/silent-renew-oidc',
  post_logout_redirect_uri: window.location.origin + "/logoutSuccess",
  silent_redirect_uri: window.location.origin + "/silent-renew-oidc", //'http://identity.novigodemo.com/silent-renew-oidc',
  automaticSilentRenew: true,
  //"acr_values": "tenant:MasterTenant"
  //"acr_values": "tenant:MasterTenant idp:AzureAD"
};
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    oidcStore: vuexOidcCreateStoreModule(
      oidcSettings,
      // NOTE: If you do not want to use localStorage for tokens, in stead of just passing oidcSettings, you can
      // spread your oidcSettings and define a userStore of your choice
      // {
      //   ...oidcSettings,
      //   userStore: new WebStorageStateStore({ store: window.sessionStorage })
      // },
      // Optional OIDC store settings
      // Optional OIDC event listeners
      {
        userLoaded: (user) => console.log("OIDC user is loaded:", user),
        userUnloaded: () => console.log("OIDC user is unloaded"),
        accessTokenExpiring: () => console.log("Access token will expire"),
        accessTokenExpired: () => console.log("Access token did expire"),
        silentRenewError: () => console.log("OIDC user is unloaded"),
        userSignedOut: () => console.log("OIDC user is signed out"),
        oidcError: (payload) => console.log("OIDC error", payload),
        automaticSilentRenewError: (payload) =>
          console.log("OIDC automaticSilentRenewError", payload),
      }
    ),
  },
});
