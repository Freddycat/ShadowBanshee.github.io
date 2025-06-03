<template>
  <div class="home">
    <Header />
    <NavBar />
    <Login />
    <Clouds />
    <div class="page-content">

      <h3 id="head">Welcome to the Weekly-ish Banshee!</h3>
      <div id="weekly-content">
        <Posts />
      </div>
    </div>

  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import NavBar from '../components/NavBar.vue'
import Login from './auth/Login.vue'
import Clouds from '../components/Clouds.vue'
import Button from '../components/Button.vue'
import Posts from './Posts.vue'
import { ref, onMounted } from 'vue';

</script>

<style scoped>
</style>