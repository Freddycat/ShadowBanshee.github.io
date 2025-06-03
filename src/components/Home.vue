<template>
  <div class="home">
    <Header />
    <NavBar />
    <Login />
    <Clouds />
    <div class="page-content">
      <div class="links">
        <Button isRouter isImage to="/questions" id="question">
          <img id="advice" src="@/assets/images/Advice.png" alt="" />
        </Button>
        <Tooltip
          content="Subscribe to the Periodical to read the Weekly-ish Banshee!"
          :disabled="!user.subscribed"
        >
          <Button
            isRouter
            isImage
            to="/weekly"
            id="weekly-ish"
            :disabled="!user.subscribed"
          >
            <img id="weekly" src="@/assets/images/weekly-banshee.png" alt="" />
          </Button>
        </Tooltip>
      </div>

      <img class="eye" src="@/assets/images/eye.gif" />
      <div class="middle-buttons">
        <Button
          isRouter
          to="/periodical"
          class="periodical"
          isImage
          isHover
          :src="normalImg"
          :hoverSrc="hoverImg"
        >
          <template #default="{ currentSrc }">
            <img :src="currentSrc" />
          </template>
        </Button>
        <Button isRouter to="/shop" isImage class="shop">
          <img :src="shopImg" />
        </Button>
      </div>
      <Clouds />

      <div class="explore">
        <Button isRouter to="/explore" isImage>
          <img src="@/assets/images/zine_buttons/exploreButton.png" alt="" />
        </Button>
        <div class="explore-buttons">
          <Button
            @click="goRoute('banshee-section')"
            isImage
            isHover
            :src="imageRefs.bansheebutton1"
            :hoverSrc="imageRefs.bansheebutton2"
          >
            <template #default="{ currentSrc }">
              <img :src="currentSrc" />
            </template>
          </Button>
          <Button
            @click="goRoute('dream-section')"
            isImage
            isHover
            :src="imageRefs.dreambutton1"
            :hoverSrc="imageRefs.dreambutton2"
          >
            <template #default="{ currentSrc }">
              <img :src="currentSrc" />
            </template>
          </Button>
          <Button
            @click="goRoute('superkid-section')"
            isImage
            isHover
            :src="imageRefs.superkidbutton2"
            :hoverSrc="imageRefs.superkidbuttonopen2"
          >
            <template #default="{ currentSrc }">
              <img :src="currentSrc" />
            </template>
          </Button>
        </div>
      </div>
      <div class="social">
        <img
          src="@/assets/images/social/superkidspeech.png"
          class="superKidSpeach"
        />
        <div class="social-buttons">
          <Button isImage>
            <img
              src="@/assets/images/social/instagram-button.png"
              onclick="window.open('https://www.instagram.com/oneeyedsuperkid/', '_blank')"
            />
            <a>Instagram</a>
          </Button>
          <Button isImage>
            <img
              src="@/assets/images/social/youtube-button.png"
              onclick="window.open('https://www.youtube.com/@oneeyedsuperkid', '_blank')"
            />
            <a>YouTube</a>
          </Button>
          <Button isImage>
            <img
              src="@/assets/images/social/etsy-button.png"
              onclick="window.open('https://www.etsy.com/shop/Oneeyedsuperkid', '_blank')"
            />
            <a>ETSY Shop</a>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import NavBar from "../components/NavBar.vue";
import Login from "./auth/Login.vue";
import Clouds from "../components/Clouds.vue";
import Button from "../components/Button.vue";
import Tooltip from "../components/Tooltip.vue";

import normalImg from "@/assets/images/periodical_logo_2.png";
import hoverImg from "@/assets/images/periodical_logo.png";
import shopImg from "@/assets/images/shop.png";

import imageRefs from "@/utils/images.js";

import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { useUser } from "@/store/user";
const user = useUser();

onMounted(() => {
  console.log(imageRefs.superkidbutton2);
});

const router = useRouter();

const goRoute = async (section) => {
  await router.push({ name: "explore" });
  // Wait a bit to ensure component is rendered
  setTimeout(() => {
    const i = document.getElementById(section); // Or whatever your section ID is
    if (i) {
      i.scrollIntoView({ behavior: "smooth" });
    }
  }, 150); // Adjust this if needed
};
</script>

<style scoped>
.links {
  margin: 1vw;
  border-radius: 3vw;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: -8vw;
  right: 1vw;
  width: min-content;
  height: min-content;
  background-color: rgba(0, 102, 255, 0.3);
}

.links img {
  margin: 1.2vw;
  width: 6vw;
  height: auto;
  transition: transform 0.25s;
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

.eye {
  position: absolute;
  top: 5%;
  width: 20%;
  height: auto;
}

.middle-buttons {
  gap: 16vw;
  position: relative;
  margin-top: 5%;
  width: 80vw;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.shop {
  width: 22vw;
}

.periodical {
  width: 28vw;
  animation: floatUpDown 1.5s ease-in-out infinite alternate;
}

@keyframes floatUpDown2 {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(5px);
  }
}

@keyframes floatUpDown {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-5px);
  }
}

.explore {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
}

.explore-buttons {
  width: 50vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 5%;
  position: relative;
  background-image: url(../../src/assets/images/zine_buttons/buttonbackground.gif);
  background-size: cover;
  background-position: center;
}

.explore img {
  height: auto;
  margin-bottom: 10px;
  transition: transform 0.25s;
  max-width: 25vw;
  object-fit: contain;
}

.explore-buttons img:hover {
  transform: scale(1.3);
}

.explore-buttons button img:last-child {
  margin-bottom: 0;
}

.superKidSpeach {
  width: 40vw;
  min-width: 40vh;
}

.social {
  width: 48vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 1;
  margin-top: 4vw;
  margin-bottom: 10vw;
}

.social-buttons {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.social button {
  margin: 0.4vw;
  margin-left: 5vw;
  width: 12%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.25s;
  font-size: 1.2cqw;
}

.text {
  font-feature-settings: "ss01" on;
  font-feature-settings: "ss02" on;
  font-feature-settings: "ss03" on;
  font-feature-settings: "ss04" on;
  font-feature-settings: "ss05" on;
  font-feature-settings: "ss06" on;
  font-feature-settings: "ss07" on;
  font-feature-settings: "ss08" on;
}
</style>
