<template>
  <div class="header_container">
    <Button isImage isRouter to="/" class="header" type="button" @click="navigateTo('index')">
      <img src="@/assets/images/title/Oneeyedsuperkid.png" />
      <p class="title">Home of The Shadow Banshee, The Dreamwalker, The Superkid and more...</p>
    </Button>
  </div>
</template>

<script setup>
import Button from './Button.vue';
</script>

<style scoped>

img {
  max-width: 100%;
  max-height: 40vh;
  height: auto;
  width: auto;
  object-fit: contain;
  display: flex;
  justify-content: center;
  transition: transform 0.25s;
}

.header {
  background-color: none;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90vw;
}

.header:hover {
  background-color: none;
  border: none;
  outline: none;
  opacity: 0.9;
}

.header_container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.25s;
  margin: 0, auto;
}

.title {
  width: 70vw;
  margin-top: max(-8vh, -8vw);
  font-size: clamp(.1vw, 1.6vw, 1.85vh);
  z-index: 1;
  transition: transform 0.25s
}

.title:hover {
  transform: scale(1.05);
  cursor: pointer;
}
</style>
