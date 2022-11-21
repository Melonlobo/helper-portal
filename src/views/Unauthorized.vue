<template>
  <div>
    <p>You do not have permissions or your sign in failed</p>
  </div>
</template>
<script>
export default {
  mounted: function () {
    this.$$nextTick(function () {
      this.$router.push({ name: "login" });
    });
  },
};
</script>