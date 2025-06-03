<template>
  <div class="item zine">
    <Button isImage @click="open">
      <img :src="item.cover" alt="" />
    </Button>
  </div>
  <transition name="slide">
    <Modal v-if="showModal" class="info" :item="item">
      <Button isX @click="close" />
      <div class="image-carousel">
        <Button class="arrow left" @click.stop="prevImage">&#9664;</Button>

        <div class="image-container">
          <img :src="item.images[currentImage]" alt="" />
        </div>
        <div v-for="(image, index) in imageUrls" :key="index">
          <img class="ico" :src="image" />
        </div>
        <Button class="arrow right" @click.stop="nextImage">&#9654;</Button>
      </div>
      <div class="desc">
        <p>{{ item.title }}</p>
        <span>{{ item.description }}</span>
        <p class="price">${{ item.price.toFixed(2) }} USD</p>
        <Button class="add-to-cart" @click="addToCart">Add to Cart</Button>
      </div>
    </Modal>
  </transition>
</template>

<script setup>
import { ref, computed } from "vue";
import Button from "../Button.vue";
import Modal from "../Modal.vue";

const props = defineProps({ item: Object, openId: [String, Number] });
const currentImage = ref(0);

const emit = defineEmits(["open", "addToCart"]);

function addToCart() {
  emit("addToCart", props.item);
}

const showModal = computed(() => props.openId === props.item.id);

function open() {
  emit("open", props.item.id);
}

function close() {
  emit("open", null); // Close this one
}
defineExpose({ close });

function nextImage() {
  console.log("nextImage", currentImage.value, props.item.images.length);
  currentImage.value = (currentImage.value + 1) % props.item.images.length;
}
function prevImage() {
  currentImage.value =
    (currentImage.value - 1 + props.item.images.length) %
    props.item.images.length;
}
</script>

<style scoped>
span {
  white-space: pre-line;
}

.item {
  position: relative;
  display: flex;
  justify-content: center;
  width: 20vw;
  aspect-ratio: 1 / 1;
  text-align: center;
  margin: 3%;
  border-radius: 50%;
  transition: transform 0.2s;
  transition: all 0.2s;
  background-color: #83bbe9;
  font-size: 75%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  cursor: pointer;
}

.item.active {
  position: relative;
  box-sizing: border-box;
  box-shadow: 0 0 12px #ffffff;
  border: 2px solid #a06dff;
  /* Highlight */
}

.item img:hover {
  transform: scale(1.1);
}

.item.active .ico {
  width: 100%;
  transform: scale(1.25);
}

.info {
  position: fixed;
  bottom: 1vw;
  right: 1vw;
  width: 98vw;
  max-height: 90vh;
  background-color: #ffffff;
  color: black;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 1vw;
  display: flex;
  flex-direction: row;
  z-index: 800;
  font-size: clamp(16px, 3vw, 5vh);
  font-weight: bolder;
  text-align: center;
}

.add-to-cart {
  min-width: 15vw;
  height: 10%;
  margin: 5%;
  background-color: #7fc0fd;
  border-radius: 1vw;
  border: solid 2px rgb(0, 9, 133);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 2vw;
}

.add-to-cart:hover {
  background-color: #c6e3ff;
  transform: scale(1.15);
}

.info .desc {
  padding: 0% 5%;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.info .desc span {
  font-size: clamp(16px, 1.2vw, 4vh);
  font-weight: unset;
}

.price {
  font-size: 2.8vw;
  margin-bottom: -3%;
}

.image-carousel {
  width: 99%;
  height: 99%;
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
  margin: 1%;
  overflow: hidden;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-in-out;
  height: 100%;
  width: 100%;
}

.image-container img {
  max-height: 60vh;
  width: auto;
  object-fit: contain;
  object-position: center;
  flex-shrink: 0;

  padding-left: 5%;
  padding-right: 5%;
}

.arrow {
  position: absolute;
  color: rgba(255, 255, 255, 0.5);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 3vw;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
  transition: all 0.2s;
}

.arrow:hover {
  color: rgba(255, 255, 255, 1);
}

.arrow.left {
  left: 8vw;
}

.arrow.right {
  right: 8vw;
}

.slide-enter-active {
  transition: bottom 0.3s ease;
}

.slide-enter-from {
  bottom: -100%;
}

.slide-enter-to {
  bottom: 1vw;
}

.slide-leave-from {
  bottom: 1vw;
}

.slide-leave-active {
  transition: bottom 0.3s ease;
}

.slide-leave-to {
  bottom: -100%;
}
</style>
