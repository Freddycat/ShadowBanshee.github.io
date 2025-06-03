<template>
  <div id="top" class="home">
    <Header />
    <NavBar />
    <Login />
    <Clouds />
    <div class="page-content">
      <div class="explore">
        <Button isImage>
          <img src="@/assets/images/zine_buttons/exploreButton.png" alt="" />
        </Button>
        <div class="explore-buttons">
          <Button
          @click="scrollTo('banshee-section')"
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
          @click="scrollTo('dream-section')"
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
          @click="scrollTo('superkid-section')"
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

      <div id="superkid-section" class="section">
        <img
          class="superKidHeader"
          src="@/assets/images/explore/superKidHeader.png"
          alt=""
        />
        <img
          class="superWalk"
          src="@/assets/images/explore/superWalk.gif"
          alt=""
        />
        <img
          class="mp3s"
          src="@/assets/images/explore/superKidMP3s.png"
          alt=""
        />
        <Button
          isImage
          class="origin"
          onclick="window.location.href='periodical'"
        >
          <img src="@/assets/images/explore/originOfSuperKid.png" />
        </Button>

        <div id="comic">
          <Button isImage id="close" onclick="closeComic()">X</Button>
          <img
            id="comicPage"
            src="@/assets/images/explore/book/zine/superkidminizine1.png"
            alt=""
          />
          <div class="navigation-buttons">
            <Button isImage id="prevBtn" onclick="prevPage()">
              <img
                src="@/assets/images/periodical/TSBP1/Buttons/back_button.png"
                alt=""
              />
            </Button>
            <Button isImage id="nextBtn" onclick="nextPage()">
              <img
                src="@/assets/images/periodical/TSBP1/Buttons/next_button.png"
                alt=""
              />
            </Button>
          </div>
        </div>

        <Button isImage id="book" onclick="comic()">
          <img
            id="bookImage"
            src="@/assets/images/explore/book/bookClosed.png"
            alt=""
          />
          <span id="bookDots"></span>
        </Button>
        <a
          href="https://www.instagram.com/oneeyedsuperkid/"
          target="_blank"
          rel="noopener"
          >@Oneeyedsuperkid</a
        >
      </div>

      <div id="banshee-section" class="section">
        <img
          id="bansheeHeader"
          src="@/assets/images/explore/shadowBansheeHeader.png"
        />
        <Button isImage id="advice" onclick="window.location.href='questions'">
          <img src="@/assets/images/Advice.png" />
        </Button>
        <div id="door">
          <img id="doorImage" src="@/assets/images/explore/door/door1.png" />
        </div>
        <img id="twisty" src="@/assets/images/explore/twisty.gif" />
        <Button
          isImage
          id="periodical"
          onclick="window.location.href='periodical'"
        >
          <img src="@/assets/images/periodical_logo.png" />
        </Button>
        <a
          href="https://www.instagram.com/theshadowbanshee/"
          target="_blank"
          rel="noopener"
          >@TheShadowBanshee</a
        >
      </div>

      <div id="dream-section" class="section">
        <img
          class="dreamWalkerHeader"
          src="@/assets/images/explore/dreamWalkerHeader.png"
          alt=""
        />
        <img class="nimWalk" src="@/assets/images/explore/nimWalk.gif" alt="" />
        <a
          href="https://www.instagram.com/the.dream.engine/"
          target="_blank"
          rel="noopener"
          >@the.dream.engine</a
        >
      </div>

      <div v-show="showButton" @click="scrollTo('top')" id="backToTopBtn" title="Back to Top">Back to Top</div>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import NavBar from "../components/NavBar.vue";
import Login from "./auth/Login.vue";
import Clouds from "../components/Clouds.vue";
import Button from "../components/Button.vue";

import imageRefs from "@/utils/images.js";

import { ref, onMounted, onUnmounted } from "vue";

const showButton = ref(false)

function handleScroll() {
  showButton.value = window.scrollY > 20
}

onMounted(() => {
  console.log(imageRefs.superkidbutton2);
  window.addEventListener('scroll', handleScroll)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function scrollTo(section) {
  const i = document.getElementById(section);
  if (i) {
    i.scrollIntoView({ behavior: "smooth" });
  }
}

</script>

<style scoped>

.page-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: auto;
}

.explore {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
}

.explore Button {
  animation: floatUpDown 1s infinite alternate;

  animation-timing-function: steps(3);
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

.explore-buttons Button img:last-child {
  margin-bottom: 0;
}

@keyframes floatUpDown {
  0% {
    transform: translateY(-1%);
  }

  100% {
    transform: translateY(1%);
  }
}

div.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 90vh;
  width: 75vw;
  margin: 0 auto;
  margin-top: 3%;
  margin-bottom: 3%;
  position: relative;
  background-image: url("/Images/ZineButtons/buttonbackground.gif");
  background-size: cover;
  background-position: center;
}

.buttons Button {
  max-width: 50%;
}

.buttons Button img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  transition: transform 0.25s;
}

.buttons img:hover {
  transform: scale(1.3);
}

.buttons Button img:last-child {
  margin-bottom: 0;
}

.section {
  max-width: 100vh;
  margin: auto;
  margin-top: 5%;
  margin-bottom: 5%;
  background-color: aliceblue
}

#banshee-section {
  position: relative;
  border-radius: 3vw;
  width: 90vw;
  display: flex;
  flex-direction: column;
  padding-bottom: 5%;
}

#banshee-section a {
  margin-top: 1%;
  margin-left: 55%;
}

#bansheeHeader {
  margin-top: 5%;
  margin-left: 5%;
  width: 65%;
}

#advice {
  width: 15%;
  height: auto;
  margin-left: 75%;
  margin-top: -25%;
}

#door {
  width: 40%;
  margin-top: 10%;
  margin-bottom: -65%;
  margin-left: -3%;
}

#doorImage {
  width: 100%;
  transition: all 0.2s ease-in-out;
}

#twisty {
  position: relative;
  width: 29%;
  margin: auto;
  margin-top: -2%;
  margin-left: 68%;
  top: -15%;
}

#periodical {
  width: 44%;
  margin: auto;
  margin-top: -38%;
}

#superkid-section {
  position: relative;
  border-radius: 3vw;
  width: 90vw;
  display: flex;
  flex-direction: column;
  padding-bottom: 5%;
}

#superkid-section a {
  margin-top: -10%;
  margin-left: 55%;
}

.superWalk {
  margin: auto;
  margin-right: 5%;
  width: 20%;
}

.origin {
  width: 38%;
  margin: auto;
  margin-top: -25%;
}

.mp3s {
  width: 25%;
  margin-left: 12%;
  margin-top: -29%;

  animation: floatUpDown 1s infinite alternate;

  animation-timing-function: steps(2);
}

#book {
  display: flex;
  margin-top: -10%;
  width: 30%;
  align-items: center;
  text-align: center;
  justify-content: center;
}

#bookDots {
  display: none;
  position: absolute;
  margin: auto;
  text-align: center;
  justify-content: center;
  left: 13%;
  margin-top: 10%;
}

#bookDots::after {
  content: ".";
  /* Initial single dot */
  animation: dots 1.33s steps(4, end) infinite;
}

@keyframes dots {
  0% {
    content: ".";
  }

  33% {
    content: "..";
  }

  66% {
    content: "...";
  }

  100% {
    content: "";
  }
}

#comic.show-comic {
  opacity: 1;
  /* Fade in */
  transform: scale(1);
  /* Full size */
  z-index: 1;
}

#comic {
  justify-content: center;
  display: flex;
  height: 30%;
  max-width: 75vh;
  width: 55vw;
  background-color: #000fde6b;
  border-radius: 3vw;
  border-bottom-left-radius: 0%;
  border: solid 1px aliceblue;
  padding: 5%;
  position: absolute;
  left: 17%;
  margin-top: 33%;
  z-index: 0;
  transform: scale(0);
  transition: transform 0.3s;
  transform-origin: bottom left;
}

#close {
  width: fit-content;
  position: absolute;
  padding: 1% 1.8%;
  border-radius: 50%;
  background-color: aliceblue;
  cursor: pointer;
  right: 3%;
  top: 5%;
}

#dream-section {
  position: relative;
  border-radius: 3vw;
  width: 90vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 5%;
}

.dreamWalkerHeader {
  margin: auto;
  margin-top: 5%;
  margin-bottom: 5%;
  margin-left: 9%;
  width: 90%;
}

.nimWalk {
  width: 45%;
  margin: auto;
  margin-top: 5%;
}

#backToTopBtn {
  position: fixed;
  bottom: 10px;
  right: 10px;
  color: rgba(0, 140, 255, 0.75);
  text-shadow: 1px 1px 0 #000000;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 32px;
  cursor: pointer;
  transition: color 0.3s;
}

#backToTopBtn:hover {
  color: rgb(154, 137, 252);
}

a:hover {
  transform: scale(1.3);
}

a {
  color: #000000;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;
}
</style>
