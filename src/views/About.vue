<template>
  <div class="about">
    Login Page
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      values: ["no data yet"],
      services: []
    }
  },
  methods: {
    /*
    async callApi() {
      try {
        const response = await axios.get("http://localhost:3000/weatherforecast/getdata");
        this.values = response.data;
      } catch (err) {
        this.values.push("Ooops!" + err);
      }
    },
    async callSecureApi() {
      try {
        const response = await axios.get("http://localhost:3000/weatherforecast/getdata");
        this.services = response.data;
      } catch (err) {
        console.log('secure api call failed');
      }
    }
    */
  }
}
</script>

