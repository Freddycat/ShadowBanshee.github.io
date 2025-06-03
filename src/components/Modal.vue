<template>
    <div :class="[modalClasses, customClass]">
        <slot></slot>
    </div>
</template>

<script setup>

import { computed } from 'vue';

const props = defineProps({
  isOverlay: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: [String, Array, Object],
    default: null,
  }
});

const modalClasses = computed(() => {
  const classes = ['modal'];
  if (props.isOverlay) {
    classes.push('modal--overlay');
  } else {
    classes.push('modal--window');
  }

  return classes;
});

</script>

<style scoped>

.modal {
  border-radius: 1vw;
  position: fixed;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 32px 32px rgba(0, 0, 0, 0.8);
  z-index: 990;
}

.modal--overlay {
  position: fixed;
  top: 1.32vw;
  left: 1.32vw;
  right: 1.32vw;
  bottom: 1.32vw;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 32px 32px rgba(0, 0, 0, 0.8);
  display: flex;
  overflow-y: auto;
  z-index: 1000;
}
</style>
