<template>
  <nav class="navbar">
    <Button isRouter to="/explore">Explore</Button>
    <Button isRouter to="/periodical">Periodical</Button>
    <Button isRouter to="/gallery">Art</Button>
    <Button isRouter to="/faq">FAQ</Button>
    <Button isRouter to="/shop">Shop</Button>
    <Button isRouter to="/locations">Locations</Button>
  </nav>
</template>

<script setup>
defineOptions({ inheritAttrs: false });
import Button from "./Button.vue";
</script>

<style scoped>

.navbar {
  position: relative;
  display: flex;
  z-index: 900;
  margin-top: 3%;
  max-width: 30vw;
  justify-content: center;

  margin: 0 auto;
  gap: 1vw;
}

@media screen and (max-width: 900px) {
  .navbar .vueButton {
    width: 10vw;
    font-size: 1.5vw;
  }
}
</style>
