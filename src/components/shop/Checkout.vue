<template>
  <transition name="Slide">
    <Modal isOverlay id="checkout">
      <Button isX @click="$emit('close')" />

      <div v-if="!success" class="checkout-form">
        <div style="flex-direction: column; max-width: 40%">
          <p>Total price: ${{ cart.totalPrice }}</p>
          <div id="checkout-items">
            <div v-for="item in cart.cart" key="item.id" class="item">
              <img :src="item.cover" />
              {{ item.title }} - ${{ item.price }}
              quantity
              {{ item.quantity }}
            </div>
          </div>
        </div>
        <form id="payment-form" @submit.prevent="doPay">
          <div v-if="loading" id="loading-indicator">
            <h3>Initializing Stripe...</h3>
            <img src="@/assets/images/gif.gif" alt="" />
          </div>

          <!-- 
          <div id="save-info">
            Do you want to save your payment method for next time?
            <Switch v-model="save1ckout" />
          </div> 
          -->

          <h3>Shipping info</h3>

          <div id="address-element" ref="addressRef"></div>

          <h3>Please double check ALL of your information! Payment Info</h3>
          <div id="payment-element" ref="paymentRef"></div>
          <div id="payment-result"></div>

          <div v-if="paying" id="paying-indicator">
            <h3>Initializing Stripe...</h3>
            <img src="@/assets/images/gif.gif" alt="" />
          </div>

          <Button type="submit">Pay</Button>
        </form>
      </div>
      <div v-if="success" id="ultimatum-result">
        <h3>
          Payment successfull!
          <br />
          <br />Feel free to close out of checkout <br />and continue browsing
          our site! <br />THANKS!
        </h3>
      </div>
    </Modal>
  </transition>
</template>

<script setup>
import Button from "../Button.vue";
import Switch from "../Switch.vue";
import Modal from "../Modal.vue";
import { onMounted, computed, ref, nextTick } from "vue";
import { useCart } from "@/store/cart";
import { useStripe } from "@/store/stripe";
import { useAlert } from "@/utils/alert";

const alert = useAlert();

const stripe = useStripe();
const cart = useCart();
const emit = defineEmits(["close"]);
const amount = computed(() => cart.totalPrice * 100);

const saveCheckout = ref(true);
const addressRef = ref(null);
const paymentRef = ref(null);
const emailRef = ref(null);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await stripe.InitStripe();

  if (amount.value > 0) {
    try {
      const clientSecret = await stripe.FetchClientSecret(amount.value);
      await stripe.MountElements(
        clientSecret,
        addressRef.value,
        paymentRef.value,
        emailRef.value
      );
      loading.value = false;
    } catch (error) {
      console.error("Error setting up payment:", error);
    }
  } else {
    console.warn("Amount is 0 or less. No payment setup.");
  }
});

const submitted = ref(false);
const success = ref(false);
const paying = ref(false);

async function doPay() {
  if (submitted.value) return; // Prevent double submission
  console.log("paying...");
  paying.value = true;
  submitted.value = true;
  success.value = false;
  nextTick(() => {
    scrollTo("paying-indicator");
  });

  try {
    const confirm = await stripe.ConfirmPayment();
    if (confirm) {
      success.value = true;
      paying.value = false;
      cart.ClearCart();
      alert("Payment successful!", "success", 3000);
    }
  } catch (error) {
    console.error("Payment error:", error);
  }
}

function scrollTo(section) {
  const i = document.getElementById(section);
  if (i) {
    i.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<style scoped>
input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #0070f3;
  box-shadow: 0 0 0 2px rgba(141, 151, 255, 0.5);
  outline: none;
}

#checkout {
  position: fixed;
  display: flex;
  margin: auto;
  height: 90%;
  width: 90%;
  max-width: fit-content;
  max-height: fit-content;
  background-color: #ffffff;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 1vw;
  flex-direction: column;
  transition: right 0.3s ease;
  z-index: 999;
  overflow-y: scroll;
  padding: 1.8vw;
}

#checkout.active {
  top: 5%;
}

#close {
  width: fit-content;
  position: relative;
  border-radius: 50%;
  background-color: aliceblue;
  cursor: pointer;
}

.cart-item-content {
  justify-content: space-between;
  margin: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
}

.cart-item {
  text-align: center;
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  border-radius: 1vw;
}

.cart-item-desc {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-items: center;
}

.cart-item-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: auto;
}

.cart-item-image {
  width: 15cqw;
  height: auto;
  margin-right: 10px;
}

.total-price {
  display: flex;
  margin: auto;
  margin-top: 10px;
  font-weight: bold;
}

.cart-item-price {
  margin: auto;
  margin-right: 10px;
}

.cart-item-quantity {
  margin: auto;
  margin-right: 10px;
}

.cart-item-name {
  display: flex;
  font-weight: bold;
  /* Make the name bold */
}

.checkout-form {
  height: 100%;
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: row;
}

#checkout-items {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 1vw;
  overflow: auto;
  max-height: 90%;
}

.item img {
  height: 100%;
  width: auto;
}

.item {
  border: black 1px solid;
  border-radius: 1vw;
  display: flex;
  flex-direction: row;
  height: 12vh;
}

#loading-indicator {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#loading-indicator img {
  display: block;
  margin: auto;
  width: 30%;
}

#email {
  margin-top: -5%;
}

#payment-form {
  margin: 4%;
  margin-top: 0;
  margin-bottom: 0;
  padding: 1%;
  width: fit-content;
  display: flex;
  flex-direction: column;
  width: 50%;
  overflow: scroll;
}

#submit {
  display: flex;
  justify-content: center;
  padding: 2%;
  margin: auto;
  margin-top: 5%;
  width: 20%;
  border-radius: 3vw;
  border: 1px solid #0070f3;
  background-color: rgba(0, 255, 255, 0.219);
  transition: all 0.05s;
}

#submit:hover {
  border: 1px solid #0070f3;
  background-color: rgba(0, 255, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(141, 151, 255, 0.5);
  /* Blueish shadow */
  cursor: pointer;
  scale: 1.1;
}

#payment-result {
  margin: auto;
  margin-top: 1%;
}

#ultimatum-result {
  margin: 0;
  padding: 0;
  max-height: fit-content;
}

input {
  font-family: monospace;
}
</style>
