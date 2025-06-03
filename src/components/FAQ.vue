
<template>
  <div class="home">
    <Header />
    <NavBar />
    <Login />
    <div class="page-content">

      <div id="container">
        <div id="faq1" style="white-space: pre-line;">
          <div class="text">
            <h3>Who am I</h3>
            <p>{{ faq1text }}</p>
          </div>
          <img src="@/assets/images/faq/faqpage.png" alt="">
        </div>
        <div id="faq2">
          <div class="text">
            <h3>WHAT IS THE SHADOW BANSHEE PERIODICAL</h3>
            <p>{{ faq2text }}</p>
          </div>
          <img src="@/assets/images/faq/faqpage1.png" alt="">
        </div>
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

const faq1text = `I frequently ask myself this.

I am an interdimensional,
independent multidisciplinary multidilusionary artist.
I make approximately three different comics.
I sing, I dance, what can't I do?
(code. My brother created this whole site :)`;

const faq2text = `(How does it work?)

The periodical is a zine that I make,
featuring the shadow banshee comics,
and the shadow banshee advice column,
where it answers questions sent in by readers.

it also contains my other comics, NAMELY:

oneeyedsuperkid (that's me) and
The dreamwalker (IF YOU LIKE ESCAPISM)

I have thoughtfully created many options for obtaining it,
either via the periodical subscription, or on my
online shop OR at local comic book shops chicagoland only!*
(*For now)`;
</script>

<style scoped>

p {
  white-space: pre-line;
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

#container {
  box-shadow: inset .1vw .1vw .1vw .1vw rgba(0, 0, 0, 0.2);;
  background-color: rgba(4, 0, 54, 0.1);
  margin: 3vw;
  width: 90vw;
  max-width: 920px;
  border: 1px black solid;
  border-radius: 1.5vw;
  display: flex;
  flex-direction: column;
}

#faq1 {
  display: flex;
  flex-direction: row;
  padding: 3%;
  border-radius: 1vw;
  width: 100%;
}


#faq2 {
  display: flex;
  flex-direction: row;
  padding: 3%;
  border-radius: 1vw;
  width: 100%;
}

img {
  margin: auto;
  width: 30%;
}

.text {
  display: flex;
  flex-direction: column;
  width: 50%;
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