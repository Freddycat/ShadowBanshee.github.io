<script setup>
import Header from "../components/Header.vue";
import NavBar from "../components/NavBar.vue";
import Login from "./auth/Login.vue";
import Clouds from "../components/Clouds.vue";
import Button from "../components/Button.vue";
</script>

<template>
  <div class="home">
    <Header />
    <NavBar />
    <Login />
    <div class="page-content">
      <div class="art-container">
        <img src="@/assets/images/gallery/art-wall/eyeSeeYou.png" alt="" />
        <img src="@/assets/images/gallery/art-wall/OESKALGORITHM.png" alt="" />
        <img
          src="@/assets/images/gallery/art-wall/wasthatreallyyou.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.home {
  background: url("@/assets/images/gallery/background/artwall.png") no-repeat
    center center fixed;
  background-size: cover;
}

.page-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: auto;
}

.art-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 1000px;
  width: 90vw;
  padding: 5%;
}

.art-container img {
  width: 30%;
  padding: 1%;
}
</style>
