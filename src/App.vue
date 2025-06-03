<template>
  <Alert ref="alertRef" />
  <RouterView />
</template>

<script setup>
import { ref, provide, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

import Alert from "./components/Alert.vue";

const alertRef = ref(null);

onMounted(() => {
  if (!alertRef.value) {
    console.warn('Alert ref not found');
    return;
  }

  provide("setAlert", (msg, type = 'error', duration = 5000) => {
    alertRef.value.setAlert(msg, type, duration);
  });
});

import './assets/fonts.css';

</script>

<style>

body {
  margin: 0;
  padding: 0;
}

.home {
  background: url(../../src/assets/images/bg.png) no-repeat center center fixed;
  background-size: cover;
  padding: 0%;
  margin: 0%;
  min-height: 100vh;
  font-family: "AlterEgo BB W00 Regular";
}

img {
  width: 100%;
}

</style>
