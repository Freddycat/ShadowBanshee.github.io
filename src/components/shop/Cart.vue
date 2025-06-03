<template>
  <Button class="cart-button" @click="isCart = true">
    🛒 <span id="count">{{ cart.cart.length }}</span>
  </Button>
  <transition name="Slide">
    <Modal class="cart-sidebar slide-in-done" v-if="isCart">
      <Button isX @click="isCart = false" />
      <div class="cart-content">
        <h2 style="margin: 1vw">Your Cart:</h2>
        <Button
          style="margin-bottom: 1vw"
          @click="$emit('checkout'), (isCart = false)"
          >Proceed to Checkout</Button
        >
        <div class="total-price">
          <p>Total Price: ${{ cart.totalPrice }}</p>
        </div>
        <div id="cart-items">
          <div v-for="item in cart.cart" key="item.id" class="item">
            <img :src="item.cover" />
            <div
              style="
                position: relative;
                display: inline-flex;
                flex-direction: column;
                margin: 0;
                padding: 0;
                height: fit-content;
                width: 100%;
              "
            >
              <p style="max-width: fit-content">{{ item.title }}</p>
              <p style="max-width: fit-content">Price: ${{ item.price }}.00</p>
              <p style="max-width: fit-content">
                Qty: ( {{ item.quantity }} ) ――― Remove?
              </p>
              <Button isX @click="remove(item)" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import Button from "../Button.vue";
import Modal from "../Modal.vue";
import { useCart } from "@/store/cart";

const cart = useCart();
const isCart = ref(false);
const emit = defineEmits(["checkout"]);

function remove(item) {
  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart.RemoveFromCart(item);
  }
}
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

.cart-button {
  position: relative;
  display: flex;
  flex-direction: row;
  top: 8;
  right: 8vw;
  color: #ffffff;
  z-index: 900;
  cursor: pointer;
}

#count {
  display: inline-flex;
  border-radius: 1vw;
  background-color: red;
}

.cart-sidebar {
  position: fixed;
  display: flex;
  justify-content: space-between;
  top: 1vw;
  height: fit-content;
  min-height: 200px;
  max-height: 90vh;
  width: 320px;
  max-width: 90%;
  padding: 1vw;
  background-color: #ffffff;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 1vw;
  flex-direction: column;
  z-index: 1000;
  overflow: auto;
}

.cart-items {
  height: fit-content;
}

.item {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  border-radius: 1vw;
}

.item :deep(.x-button) {
  width: 2vw;
  top: auto;
  bottom: 0.4vw;
  right: 0.4vw;
}

.item img {
  width: 30%;
}

#loading {
  width: 50%;
  margin-left: 25%;
  margin-top: -15%;
}

#error-message {
  font-family: "Sans";
}

#account-area {
  display: flex;
  flex-direction: row;
}

#account-loading {
  width: 35%;
  margin-top: -5%;
}

.slide-in-done {
  right: 1vw;
}

.Slide-enter-from {
  right: -120vw;
}

.Slide-enter-active {
  transition: right 0.3s ease;
}

.Slide-enter-to {
  right: 1vw;
}

.Slide-leave-from {
  right: 1vw;
}

.Slide-leave-active {
  transition: right 0.3s ease;
}

.Slide-leave-to {
  right: -120vw;
}
</style>
