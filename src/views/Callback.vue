<template>
  <div>
    <p>Sign-in in progress1222</p>
  </div>
</template>

<script>
export default {
  async created() {
    /*
            var result = this.$root.mgr.signinRedirectCallback();
            this.$root.mgr.signinRedirectCallback(null).then(function (user) {
                debugger
                console.info(user);
            }).catch((error) =>{
                debugger
                console.info(error);
            });
            */

    try {
      var result = await this.$root.mgr.signinRedirectCallback();

      /*
                result.then(function (user){
                debugger;
                }).catch(function (e) {
                    console.error(e);
                });
                */

      var returnToUrl = "/";
      if (result.state !== undefined) {
        returnToUrl = result.state;
      }
      this.$router.push({ path: "/home" });
    } catch (e) {
      this.$router.push({ name: "Unauthorized" });
    }
  },
};
</script>