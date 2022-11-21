<template>
  <div class="wrpr pb-4">
    <nav class="navbar navbar-expand-lg navbar-light">
      <a class="navbar-brand m-xs-auto" href="#">
        <img
          src="../assets/images/NovigoLogo.png"
          width="auto"
          height="35"
          class="d-inline-block align-top"
          alt=""
          style="background: white; border-radius: 5px; padding: 4px"
        />
        <h5 class="d-none text-black d-sm-inline ml-2" style="line-height: 1.8">
          Helper Service Portal
        </h5></a
      >
    </nav>
    <div class="pb-3">
      <img src="static/Logo.png" style="height: 30px" alt />
    </div>
    <div class="container vh-80">
    <h1 class="mt-4 mb-4">You signed out of your account</h1>
    <p>It's a good idea to close all browser windows.</p>
    <div class>
      <br />
      <router-link class="btn btn-outline" to="/home">Login</router-link>
    </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  background: #fff;
    border-bottom: 1px solid #e0e4e9;

}
a.btn.btn-outline {
  border: 1px solid #a7a7a7;
  border-radius: 2px;
}
.wrpr {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  height: 100%;
}
.wrpr h1 {
  font-size: 30px;
  font-weight: 700;
  line-height: 0.7;
}
.wrpr h4 {
  font-size: 20px;
  font-weight: 700;
  line-height: 0.7;
}
p {
  font-size: 16px;
  color: #666;
  line-height: 1.4;
}
a {
  font-size: 16px;
  font-weight: 700;
}
</style>
