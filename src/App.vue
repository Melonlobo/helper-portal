<template>
  <div id="app">
    <router-view />
    <div id="snackbar"></div>
  </div>
</template>

<style>
.content {
  height: 80vh;
}
#app {
  font-family: proxima-nova,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
.nav-link {
  color: #424242;
  padding: 0.5rem 0.5rem;
  text-align: left;
  text-overflow: clip;
  font-size: 0.9rem;
}
#nav a {
  font-weight: bold;
  color: #d4dce4;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#sidebar {
  background: transparent;
  background-size: cover;
  border-right: 2px solid #445366;
}
.home {
  /* background-image: url("./assets/images/bg.svg"); */
  background:#f5f6fa;  
  /*#d4dce4;*/
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
.title {
  padding-left: 50px;
  margin-bottom: 30px;
  color: azure;
}

.panel-heading {
  color: black;
  background: white;
  padding: 0.5rem;
  border-radius: 5px;
  margin: 0px 0px 10px 0px!important;
}
.dropdown-menu {
  left: -60px;
}
a:hover {
  color: #303f9f;
}
#snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: rgb(146, 36, 36);
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 17px;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

.c-danger{
    color:red;
}

.p-b-10{
  padding-bottom: 10px;
}

.mb-10{
  margin-bottom: 10px;
}

h2{
  margin-bottom: 0.1rem!important;
}

.btn-heading{
  float: right;
  right: 5px;
  bottom: 36px;
}

.ml-0{
  margin-left: 0px!important;
}

.btn-popup{
  padding:10px
}

.mr-10{
  margin-right: 10px;
}

</style>
