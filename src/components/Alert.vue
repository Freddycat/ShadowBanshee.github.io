<template>
  <div id="alert" v-if="alerts.length">
    <div
      v-for="(alert, index) in alerts"
      :key="index"
      class="alert-box"
      :class="alert.type"
    >
      <span>{{ alert.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const alerts = ref([]); // Reactive array to store alerts

const setAlert = (message, type = "error", duration = 5000) => {
  alerts.value.push({ message, type });

  setTimeout(() => {
    alerts.value.shift();
  }, duration);
};

defineExpose({
  setAlert,
});

import '../assets/fonts.css';

</script>

<style scoped>

#alert {
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: 999;
  width: 100%;
}

.alert-box {
  position: relative;
  top: 15%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #f5c6cb;
  padding: 15px;
  margin: 10px auto;
  width: max-content;
  max-width: 500px;
  border-radius: 1vw;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: slide-down 0.2s ease forwards;
  position: relative;
}

@keyframes slide-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}
</style>
