<template>
  <section class="webinar-login-wrap">
    <div class="login-main">
      <div class="row">
        <div class="col">
          <div class="text-white login-disc">
            <a
              href="https://www.novigosolutions.com/"
              target="_blank"
              class="insight-logo"
            >
              <img
                class="bg-white"
                src="../assets/images/logo.svg"
                style="
                  width: auto;
                  padding: 20px;
                  border-radius: 20px;
                  height: 100px;
                "
              />
            </a>
            <h1>Novigo Identity</h1>
            <h3>Authentication and Authorisation Portal</h3>
            <!-- <h5 class="font-weight-light line-height">
              AI-based technology enables you to facilitates brilliant insights
              by transcribing audio into analyzable text.
            </h5>

            <a href="#" class="anim-logo d-block mb-3">
              <img src="../assets/images/anima.svg" />
            </a> -->
          </div>
        </div>
        <div class="col-md-5">
          <div class="webinar-login">
            <div class="webinar-content">
              <div class="login-container p-5 bg-white">
                <div class="login-contents">
                  <h3 class="mb-4 mt-4">Log in</h3>
                </div>

                <form method="POST" @submit.prevent="signin">
                  <div id="login-form" class="form">
                    <div class="form-group">
                      <div class="input-group input-group-lg h5">
                        <div class="input-group-prepend">
                          <span
                            class="input-group-text border-right-0 bg-white"
                          >
                            <img src="../assets/images/ic_account_circle.svg" />
                          </span>
                        </div>
                        <input
                          type="text"
                          value=""
                          v-model.lazy="userData.userName"
                          name="username"
                          class="form-control border-left-0 small text-secondary"
                          id="username"
                          placeholder="Username or email"
                          required
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="input-group input-group-lg h5">
                        <div class="input-group-prepend">
                          <span
                            class="input-group-text border-right-0 bg-white"
                          >
                            <img src="../assets/images/ic_vpn_key.svg" />
                          </span>
                        </div>
                        <input
                          type="password"
                          v-model="userData.password"
                          value=""
                          name="password"
                          class="form-control border-left-0 border-right-0 small"
                          id="password"
                          placeholder="Password"
                          required
                        />

                        <div class="input-group-append">
                          <span class="input-group-text border-left-0 bg-white">
                            <!-- <img src="../assets/images/ic_visibility.svg" /> -->
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      class="form-group d-flex justify-content-between align-items-center my-3"
                    >
                      <!-- <div class="custom-control custom-checkbox">
                                                <input type="checkbox" class="form-check-input custom-control-input" id="remember" value="">
                                                <label class="form-check-label custom-control-label small text-secondary" for="remember">
                                                    Remember me
                                                </label>
                                            </div> -->
                      <!-- <a href="#" class="small text-secondary">
                                                Forgot password?
                                            </a> -->
                    </div>
                    <div class="form-group mt-4">
                      <button
                        type="submit"
                        class="btn btn-submit d-block"
                        style="width: -webkit-fill-available; margin-top: -17px"
                      >
                        Login
                      </button>
                    </div>
                    <p
                      class="error text-danger text-center"
                      v-if="
                        !$v.userData.password.strongPassword &&
                          $v.userData.password.$dirty
                      "
                    >
                      <strong>Error:</strong>Invalid Password
                    </p>

                    <p style="text-align: center"></p>
                  </div>
                </form>
              </div>
              <!-- <div class="form-group justify-content-center">
                                <a href="https://www.novigosolutions.com/" target="_blank" class="sub-logo d-block pt-3 text-center">
                                    <img src="../assets/images/logo-footer.svg" />
                                </a>
                            </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import queryString from "querystring";
import { required } from "vuelidate/lib/validators";

export default {
  name: "Login",
  data: function() {
    return {
      userData: {
        userName: "",
        password: "",
      },
    };
  },
  validations: {
    userData: {
      password: {
        required,
        strongPassword(password) {
          return (
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) && // checks for a-z
            /[0-9]/.test(password) && // checks for 0-9
            /\W|_/.test(password) && // checks for special char
            password.length >= 8
          );
        },
      },
    },
  },
  methods: {
    signin: async function() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        var data = {
          client_id: "25e86c18-592e-47b8-a218-629d24d213a0",
          client_secret: "4aafb305-c0c7-483b-a890-ae0a80f099af",
          grant_type: "password",
          username: this.userData.userName,
          password: this.userData.password,
        };
        var options = {
          method: "Post",
          // url: "https://novigoidentityapi.azurewebsites.net/connect/token",
          url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            // 'Authorization': 'Basic ' + btoa('postman.app' + ":" + 'b87f1485-5d50-4bb3-a00c-2889731264bd')
          },
          data: queryString.stringify(data),
        };
        var that = this;
        try {
          axios
            .request(options)
            .then(function(response) {
              console.log(response);
              var tokenResponse = response;
              console.log("Access token : " + tokenResponse.data.access_token);
              console.log("Status : " + tokenResponse.request.status);
              const authToken = tokenResponse.data.access_token;
              if (tokenResponse.request.status == 200 && authToken) {
                that.$root.user = tokenResponse.data;
                tokenResponse.config.headers.Authorization = `Bearer ${authToken}`;
                that.$root.isAuthenticated = true;
                that.$router.push({ name: "HelloWorld" });
              }
            })
            .catch(function(error) {
              console.error(error);
            });
        } catch (err) {
          console.log("Ooops!" + err);
        }
      }
    },
  },
};
</script>
<style scoped>
/* Add body classname in beforecreate and destory to give body styles */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap");
html,
body {
  height: 100%;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  -webkit-text-size-adjust: 100%;
  background: #f8f9fa;
  margin: 0;
  padding: 0px;
  line-height: 1.5;
}

a,
a:hover,
a:focus {
  text-decoration: none;
  transition: 400ms all ease;
}

.small,
small {
  font-size: 80% !important;
  font-weight: 400 !important;
}

.webinar-login-wrap {
  background-image: url(../assets/images/bg.svg);
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.webinar-login {
  width: 360px;
  float: right;
}

.login-container {
  border-radius: 2px;
}

.input-group img {
  width: 18px;
  height: 18px;
  filter: grayscale(0.5);
  opacity: 0.5;
}

.login-container .form-control:focus {
  box-shadow: none;
}

.btn-submit {
  height: 38px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #fff;
  background: #f83775;
  border: 0;
  background: linear-gradient(to bottom right, #f32d6c, #ff4782);
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  padding: 10px 22px;
}

.btn-submit:hover,
.btn-submit:focus {
  color: #fff;
  background: #f83775;
  border: 0;
  background: linear-gradient(to bottom right, #f32d6c, #ff4782);
}

.line-height {
  line-height: 36px;
}
.login-main {
  width: 1000px;
  margin: 0 auto;
}
a.insight-logo img {
  width: 70px;
  margin: 20px 0px 0 0px;
}
a.anim-logo img {
  width: 170px;
  margin: 20px 0px 20px 0px;
}
.login-disc {
  width: 90%;
}
.login-disc h1 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 20px 0;
  opacity: 0.99;
}
.login-disc h3 {
  font-size: 18px;
  line-height: 1.3;
  letter-spacing: 0.5px;
  opacity: 0.9;
}
.login-disc h5 {
  font-size: 18px;
  line-height: 1.3;
  letter-spacing: 0.5px;
  opacity: 0.9;
}
.login-contents h3 {
  color: #666;
}
a.navbar-brand > span {
  padding-left: 10px;
}
a.navbar-brand span span {
  color: #f83775;
}
a.navbar-brand {
  font-weight: 700;
  color: #223994;
}
.avatar {
  vertical-align: middle;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
a.navbar-brand img {
  width: 36px;
}
.search-form {
  width: 400px;
}
.navtop {
  background: #223994;
  color: #fff;
  margin: 30px 0 0 0;
  border-radius: 3px;
  overflow: hidden;
}
.navtop .nav-link.active,
.navtop .show > .nav-link {
  color: #fff;
  background-color: #f83775;
  border-radius: 0;
}
.navtop .nav-link {
  border-radius: 0;
  color: #fff;
}
.navtop .nav-link {
  display: block;
  padding: 0.8rem 1rem;
}
.tab-content {
  background: #fff;
  border-radius: 3px;
  padding: 30px;
  height: 400px;
}
.tab-content > .tab-pane {
  width: 100%;
  height: 100%;
}
.tc-w {
  align-items: center;
  justify-content: center;
  text-align: center;
}
.bg-light {
  background-color: #ffffff !important;
}
.container-tab {
  width: 800px;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
textarea {
  overflow: auto;
  resize: vertical;
  border: 1px solid #e0e0e0;
  box-shadow: none;
  border-radius: 4px;
  padding: 15px;
}

button:focus,
textarea:focus {
  outline: none !important;
}
</style>
