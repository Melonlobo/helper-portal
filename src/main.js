import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import mgr from "./services/security.js";
import axios from "axios";
import Vuelidate from "vuelidate";
import store from "./services/store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
//import '@progress/kendo-theme-default/dist/all.css'
import "./assets/styles/kendo.css";
import config from "./public/configs.json";

Vue.config.productionTip = false;
// Get Configs and store in global variable
// As of now config contains API URLs
Vue.prototype.$config = config;

const globalData = {
  isAuthenticated: false,
  user: "",
  mgr: mgr,
};

const globalMethods = {
  async authenticate(returnPath) {
    console.log("Return path", returnPath);
    const user = await this.$root.getUser(); //see if the user details are in local storage
    if (!!user) {
      this.isAuthenticated = true;
      this.user = user;
    } else {
      await this.$root.signIn(returnPath);
    }
  },
  async getUser() {
    try {
      let user = await this.mgr.getUser();
      return user;
    } catch (err) {
      console.log(err);
    }
  },
  signIn(returnPath) {
    returnPath
      ? this.mgr.signinRedirect({ state: returnPath, cur_host: "infosys" })
      : this.mgr.signinRedirect({ cur_host: "infosys" });
  },
  signout(returnPath) {
    mgr.signoutRedirect();
  },
};

Vue.use(Vuelidate);

axios.interceptors.request.use(
  (config) => {
    const authToken = store.state.oidcStore.access_token;
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (err) => {
    console.log(err);
    //What do we do when we get errors?
  }
);

function showSnackbar(message) {
  var x = document.getElementById("snackbar");
  if (typeof message !== "string" || !message instanceof String) {
    x.className = "show";
    x.innerHTML = "Request Failed";
  }

  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 3000);
}

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    NProgress.start();
    return config;
  },
  function(error) {
    // Do something with request error
    console.log(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    NProgress.done();
    return response;
  },
  function(error) {
    // Do something with response error

    showSnackbar(error.response.data.message);
    console.log(error);
    NProgress.done();

    console.log(error);
    return Promise.reject(error);
  }
);

//Start the application
let v = new Vue({
  router,
  store,
  data: globalData,
  methods: globalMethods,
  render: (h) => h(App),
}).$mount("#app");

// fetch(process.env.BASE_URL + "configs.json")
//   .then((response) => {
//     debugger
//     response.json().then((config) => {
//       debugger
//        Vue.prototype.$config = config
//        new Vue({
//          router,
//          store,
//          data: globalData,
//          methods: globalMethods,
//          render: (h) => h(App)
//        }).$mount("#app")
//     })
// })
