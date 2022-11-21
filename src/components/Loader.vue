<template>
  <div class="container"></div>
</template>

<script>
export default {
  mounted: function () {
    this.$nextTick(function () {
      this.$router.push({ name: "LandingPage" });
      // Code that will run only after the // entire view has been rendered }) }
    });
  },
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
}
</style>