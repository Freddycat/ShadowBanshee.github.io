<template>
  <div
    class="toggle-switch"
    :class="{ 'toggle-on': modelValue }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div class="toggle-thumb"></div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.toggle-switch {
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background-color: rgba(0, 102, 255, 0.3);
  border: 1px solid aliceblue;
  display: flex;
  align-items: center;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.1s, border-color 0.3s;
}
.toggle-switch:hover {
  background-color: rgba(0, 102, 255, 0.6);
  transform: scale(1.05);
}

.toggle-on {
  background-color: rgba(0, 102, 255, 1);
}

.toggle-thumb {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
  transform: translateX(0);
}

.toggle-on .toggle-thumb {
  transform: translateX(24px);
}
</style>
