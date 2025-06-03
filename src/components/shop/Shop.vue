<template>
  <div class="home">
    <Header class="homeLink" />
    <div class="ui">
      <Login />
      <Cart :cart="cart" :price="totalPrice" @checkout="viewCheckout = true" />
    </div>
    <Checkout
      :cart="cart"
      :price="totalPrice"
      v-if="viewCheckout"
      @close="viewCheckout = false"
    />
    <Clouds />
    <img class="shopHeader" src="@/assets/images/shop/shopHeader.png" alt="" />
    <div id="shop">
      <div id="filter">
        <p>Filter Items:</p>
        <div class="filterButtons">
          <Button isImage class="all" onclick="filterItems('all')">
            <img src="@/assets/images/shop/filterAll.png" alt="" />
          </Button>

          <div id="last">
            <Button isImage class="zines" onclick="filterItems('zine')">
              <img src="@/assets/images/shop/zines.png" alt="" />
            </Button>

            <Button isImage class="stickers" onclick="filterItems('sticker')">
              <img src="@/assets/images/shop/filterStickers.png" alt="" />
            </Button>
          </div>
        </div>
      </div>
      <img
        class="stripeImg"
        src="@/assets/images/stripe.svg"
        style="width: 12%; margin-left: -64%"
      />
      <div id="shopSpace">
        <img
          style="position: absolute; top: 0; left: 0; width: 10vw; z-index: 1"
          src="@/assets/images/shop/NEW.png"
        />
        <Item
          v-for="item in displayItems"
          :key="item.id"
          :item="item"
          :openId="openId"
          @addToCart="addToCart"
          @open="handleOpen"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Cart from "./Cart.vue";
import Checkout from "./Checkout.vue";
import Header from "../Header.vue";
import Login from "../auth/Login.vue";
import Clouds from "../Clouds.vue";
import Button from "../Button.vue";
import Item from "../shop/Item.vue";
import items from "../../data/items.json";
import { ref } from "vue";
import { useCart } from "@/store/cart";

const viewCheckout = ref(false);

const cart = useCart();

const images = import.meta.glob(
  "@/assets/images/shop/items/*/**/*.{png,jpg,jpeg}",
  {
    eager: true,
    import: "default",
  }
);

const openId = ref(null);

function handleOpen(id) {
  openId.value = id;
}

const itemsMap = Object.fromEntries(
  items.map((item) => [item.id, { ...item, cover: null, images: [] }])
);

for (const path in images) {
  const segments = path.split("/");
  const itemFolder = segments[segments.indexOf("items") + 1];
  const isCover = segments.includes("cover");
  const image = images[path];

  const item = itemsMap[itemFolder];
  if (!item) {
    console.warn(`No matching item for image folder: ${itemFolder}`);
    continue;
  }

  if (isCover) {
    item.cover = image;
  } else {
    item.images.push(image);
  }
  console.log(`Added image: ${image} to item: ${item}, isCover: ${isCover}`);
}
const displayItems = ref(Object.values(itemsMap));

async function addToCart(item) {
  await cart.AddToCart(item);
}
</script>

<style scoped>
#pageContent {
  padding-bottom: 50vh;
}

.ui {
  position: fixed;
  top: 1.8vw;
  right: 1.8vw;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 0.8vw;
  z-index: 999;
}

.ui :deep(#login-button) {
  position: relative;
  top: 0;
  right: 0;
}
.ui :deep(.cart-button) {
  position: relative;
  top: 0;
  right: 0;
}

.header {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  transition: transform 0.25s;
  margin: 0, auto;
}

.shopHeader {
  position: absolute;
  width: 35%;
  right: 16vw;
  top: 8vw;
  z-index: 1;
}

.homeLink {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 50vw;
  animation: floatUpDown 2s ease-in-out infinite alternate;
}

.homeLink :deep(.header) {
  width: 45vw;
}

.homeLink :deep(.title) {
  width: 35vw;
}

@keyframes floatUpDown {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(3px);
  }
}

.title {
  display: none;
}

#shop {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#filter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 40%;
  margin-bottom: 1%;
  z-index: 1;
  text-align: center;
}

.filterButtons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#last {
  margin: auto;
  display: flex;
  justify-content: center;
  gap: 8vw;
}
.all,
.zines,
.stickers {
  cursor: pointer;
  width: 8vw;
}

#shopSpace {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 80vw;
  height: auto;
  border-radius: 1vw;
  background-color: rgba(4, 0, 54, 0.2);
  margin-bottom: 5%;
  z-index: 1;
}

h2 {
  text-align: center;
  font-size: 2cqw;
  padding-bottom: 2%;
  padding-top: 2%;
  padding-left: 2%;
  border-bottom: 1px solid #ccc;
}

h3 {
  display: none;
}
</style>
