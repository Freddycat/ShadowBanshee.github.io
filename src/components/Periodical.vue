<template>
  <div class="home">
    <Header />
    <NavBar />
    <Login ref="login" />
    <Clouds />
    <Book v-if="isComic" :bookId="bookId" @close="closeBook" />
    <div class="page-content">
      <div class="center">
        <div id="flex-container">
          <div class="left button-hover">
            <Button
              isImage
              id="periodical"
              @click="scrollTo('subscription-area')"
            >
              <img src="@/assets/images/periodical_logo.png" alt="" />
              <img
                id="subButton"
                src="@/assets/images/periodical/sub button.png"
                alt=""
              />
              <div class="text2">
                <p>
                  Sign up for the Shadow Banshee<br />
                  Periodical Subscription!
                </p>
              </div>
              <img
                id="arrow"
                src="@/assets/images/periodical/arrow.png"
                alt=""
              />
            </Button>
          </div>
          <div class="right">
            <div class="top-right">
              <div id="top-right-left">
                <Button isRouter isImage to="/questions" id="question">
                  <img id="advice" src="@/assets/images/Advice.png" alt="" />
                  <div class="text">
                    <p>Ask the Banshee questions!</p>
                  </div>
                </Button>
              </div>
              <div id="top-right-right">
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
                    <img
                      id="weekly"
                      src="@/assets/images/weekly-banshee.png"
                      alt=""
                    />
                    <div class="text">
                      <p class="text3">Weekly-ish Banshee!</p>
                    </div>
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div class="bottom-right">
              <p id="read">Read the Shadow Banshee Periodical!</p>
              <div class="bottom-right-container">
                <Button
                  isImage
                  @click="toggleComic(1)"
                  id="TSBP1"
                  class="card-container"
                >
                  <img
                    class="card card-left"
                    src="@/assets/images/periodical/TSBP1/page1.png"
                    alt=""
                  />
                  <img
                    class="readMe card-left"
                    src="@/assets/images/periodical/Read me.png"
                    alt=""
                  />
                </Button>
                <Tooltip
                  content="Subscribe to the Periodical to read TSBP2 or read TSBP1!"
                  :disabled="!user.subscribed"
                >
                  <Button
                    isImage
                    @click="toggleComic(2)"
                    id="TSBP2"
                    class="card-container"
                    :disabled="!user.subscribed"
                  >
                    <img
                      class="card card-middle"
                      src="@/assets/images/periodical/TSBP2/page1.png"
                    />
                    <img
                      class="readMe card-middle"
                      src="@/assets/images/periodical/Read me.png"
                      alt=""
                    />
                  </Button>
                </Tooltip>
                <Tooltip
                  content="Subscribe to the Periodical to read TSBP3 or read TSBP1!"
                  :disabled="!user.subscribed"
                >
                  <Button
                    isImage
                    @click="toggleComic(3)"
                    id="TSBP3"
                    class="card-container"
                    :disabled="!user.subscribed"
                  >
                    <img
                      class="card card-right"
                      src="@/assets/images/periodical/TSBP3/page1.png"
                    />
                    <img
                      class="readMe card-right"
                      src="@/assets/images/periodical/Read me.png"
                      alt=""
                    />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        class="stripeImg"
        src="@/assets/images/stripe.svg"
        style="width: 12%; margin-left: -32%"
      />
      <div v-if="!user.isLoggedIn" class="login-prompt modal-content">
        <span>
          <Button style="display: inline" @click="doLogin">Log in</Button>
          or
          <Button style="display: inline" @click="doSignUp"
            >create an account
          </Button>
          to subscribe!</span
        >
      </div>
      <div v-else-if="!user.isVerified" class="login-prompt modal-content">
        <span
          >Make sure to verify your email to subscribe! Check your email, or
          resend verification!</span
        >
      </div>

      <div
        v-else-if="user.isLoggedIn"
        id="subscription-area"
        class="modal-content"
      >
        <div v-if="user.subscription === 'snail-mail'">
          <h3>Congrats!</h3>
          <p>Thank you for subscribing to the Shadow Banshee Periodical,</p>
          <p>"Interdimensional Delivery" teir!</p>
          <p>You will get Periodical Content Mailed to you bi-monthly</p>
          <p>
            Including: Periodicals, Shadow Banshee Mini Zines, and Stickers!
          </p>
          <p>
            View digital content here, and in
            <RouterLink to="/weekly">Weekly</RouterLink>
          </p>
        </div>
        <div
          v-if="
            !user.subscribed ||
            user.subscription !== 'snail-mail' ||
            !user.isVerified
          "
          id="subscription-form"
        >
          <h2>Subscribe to the Shadow Banshee Periodical!</h2>
          <h3 id="subscription-type">Select a Subscription Type:</h3>
          <div id="subscription-box">
            <div class="subscription-options button-hover">
              <div :class="{ border: free_selected }" id="free-information">
                <img
                  id="selector1"
                  class="selector"
                  src="@/assets/images/periodical/selector.png"
                  alt=""
                />
                <Button
                  @click="
                    () => {
                      free_selected = true;
                      input = 0;
                      amount = 0;
                      doAmount();
                    }
                  "
                  type="button"
                  isImage
                  class="selection-images"
                  id="free-tier"
                >
                  <img
                    src="@/assets/images/periodical/subscriptionbuttons/cybertier1.png"
                    alt=""
                  />
                  <h3>FREE CYBER TIER</h3>
                  <h3>DIGITAL SUBSCRIPTION</h3>
                  <p class="information">
                    YOU GET: DIGITAL ACCESS TO ALL PERIODICAL ISSUES Digital
                    access to the weekly-ish banshee (Free or Pay what you can!)
                  </p>
                </Button>
              </div>
              <div :class="{ border: !free_selected }" id="paid-information">
                <img
                  id="selector2"
                  class="selector"
                  src="@/assets/images/periodical/selector.png"
                  alt=""
                />
                <Button
                  @click="
                    {
                      free_selected = false;
                      input = 3;
                      amount = 300;
                      doAmount();
                    }
                  "
                  type="button"
                  isImage
                  class="selection-images"
                  id="snail-mail"
                >
                  <img
                    src="@/assets/images/periodical/subscriptionbuttons/interdimensionaldelivery1.png"
                  />
                  <h3>INTERDIMENSIONAL DELIVERY</h3>
                  <h3>SNAIL MAIL</h3>
                  <p id="snail-info" class="information">
                    (Snail-mail subscription) You get: Everything in the cyber
                    tier PLUS: Every new issue of TSB periodical in the mail!
                    (Quarterly-ish) (along with healthy quantities of stickers +
                    occasional mini zines sent at random) $3-10 monthly
                  </p>
                </Button>
              </div>
            </div>
          </div>
          <div
            v-if="
              !(user.subscription === 'free' && free_selected) &&
              !(user.subscription === 'paid' && !free_selected)
            "
            id="input-area"
          >
            <h3>Choose your subscription amount!</h3>
            <span id="subscription-description"></span>
            <label for="amount">Amount: $</label>
            <input
              @blur="doAmount"
              v-model="input"
              name="amount"
              id="amount"
              type="number"
              min="3"
              max="10"
            />
            <Button @click="register" id="register-button" class="nav-button"
              >Register</Button
            >

            <div v-if="amount_error" id="amount-message">
              {{ amount_message }}
            </div>
          </div>
          <div v-if="user.subscription === 'free' && free_selected">
            Already subscribed! Check out the Periodical or the Weekly, or
            upgrade to Snail Mail!
          </div>
        </div>
      </div>

      <Modal
        v-if="state === 'confirm' || state === 'done'"
        isOverlay
        id="checkout"
      >
        <Button isX @click="state = 'start'" />
        <template v-if="state === 'confirm'">
          <h2>Subscribing to</h2>
          <span id="checkout-description"></span><br />
          <span>Price: ${{ input }} </span>

          <span v-if="free_selected" id="free-description" class="description">
            With the Free Cyber Tier Subscription, you get updates from the
            Shadow Banshee to your Email Address! Plus, access to the
            quarterly-ish periodical, and the weekly-ish banshee archives!
          </span>
          <span
            v-if="!free_selected"
            id="snail-description"
            class="description"
          >
            With the Snail-Mail subscription, you get the Shadow Banshee
            Periodical mailed to your door! weekly-ish updates from the Shadow
            Banshee to your Email Address! Plus, digital access to the
            periodical, and the weekly-ish banshee archives!
          </span>
          <div id="payment">
            <div ref="emailRef" id="email-element"></div>
            <div ref="addressRef" id="address-element"></div>
            <div ref="paymentRef" id="payment-element"></div>
            <div id="payment-result"></div>
          </div>

          <div v-if="error_message" id="error-message">
            {{ error_message }}
          </div>

          <div v-if="loading" id="loading-indicator">
            <h2>Initializing Stripe...</h2>
            <img src="@/assets/images/gif.gif" alt="" />
          </div>

          <Button
            v-if="!loading"
            @click="confirm()"
            id="confirm-button"
            class="nav-button"
            >Subscribe</Button
          >
        </template>
        <template v-if="state === 'done'">
          <h2 style="margin-top: 1.8vw">Subscription Successful!</h2>
          <p>Thank you for subscribing to the Shadow Banshee Periodical!</p>
          <p>You will now get zines in the mail bi-monthly.</p>
          <p>Read the periodical on this page!</p>
          <p>
            read the
            <RouterLink to="/weekly">weekly-ish Banshee</RouterLink> here!
          </p>
          <p>Check your email for updates. :)</p>
          <p>
            You can manage your subscription, unsubscribe, etc, in
            <RouterLink to="/account">Account!</RouterLink>
          </p>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import NavBar from "../components/NavBar.vue";
import Login from "./auth/Login.vue";
import Clouds from "../components/Clouds.vue";
import Button from "../components/Button.vue";
import Book from "../components/Book.vue";
import Modal from "./Modal.vue";
import Tooltip from "../components/Tooltip.vue";
import { useAmount } from "@/utils/amount";

import { useStripe } from "@/store/stripe";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "@/store/user";
import { ref, watch, nextTick } from "vue";

const stripe = useStripe();

const bookId = ref(0);
const isComic = ref(false);

const toggleComic = (id) => {
  bookId.value = id;
  isComic.value = true;
  console.log(`Requesting Comic: ${id}`);
  console.log(`is Comic?: ${isComic.value}`);
};

const closeBook = () => {
  bookId.value = null;
  isComic.value = false;
};

function scrollTo(section) {
  const i = document.getElementById(section);
  if (i) {
    i.scrollIntoView({ behavior: "smooth" });
  }
}

const emailRef = ref(null);
const addressRef = ref(null);
const paymentRef = ref(null);

const state = ref("start"); // start, confirm, done

const user = useUser();
const loading = ref(false);
const clientSecret = ref(null);
const error_message = ref(null);
const customerId = ref("null");
const subscriptionRef = ref(null);
const { input, amount, amount_error, amount_message, free_selected, doAmount } =
  useAmount();

async function register() {
  console.log("clicked,", free_selected.value, input.value);
  state.value = "confirm";
  error_message.value = null;

  if (free_selected.value && amount.value === 0) {
    console.log("free_selected! & free amount!");
    return;
  } else if (free_selected.value === false && amount.value < 300) {
    console.log("no!");
    return;
  } else {
    await doPay();
  }

  async function doPay() {
    loading.value = true;
    stripe.InitStripe();
    try {
      const customer = await stripe.CreateCustomer(user.userEmail);
      if (customer.success) {
        customerId.value = customer.customer.id;
        console.log("Customer created successfully:", customerId.value);
        const subscription = await stripe.Subscribe(
          amount.value,
          customerId.value
        );
        if (subscription.success) {
          clientSecret.value = subscription.clientSecret;
          subscriptionRef.value = subscription.subscriptionId;
          console.log(
            "Subscription created successfully:",
            subscription.subscriptionId,
            subscription.clientSecret,
            clientSecret.value
          );

          if (free_selected.value) {
            await stripe.MountElements(clientSecret.value, paymentRef.value);
          } else {
            await stripe.MountElements(
              clientSecret.value,
              addressRef.value,
              paymentRef.value
            );
          }
        } else {
          error_message.value =
            subscription.error || "Failed to create subscription.";
          console.error("Failed to create subscription:", subscription.error);
          return;
        }
      } else {
        error_message.value =
          `Error: ${customer.error}` || "Failed to create customer.";
        console.error("Failed to create customer.", customer.error);
        return;
      }
    } catch (error) {
      error_message.value =
        `Unexpected error: (Not supposed to happen!) ${error.message}` ||
        "An unexpected error occurred during payment setup.";
      console.error("Error setting up payment:", error.message);
    } finally {
      loading.value = false;
    }
  }
}

async function confirm() {
  loading.value = true;
  await nextTick();
  scrollTo("loading-indicator");
  error_message.value = null;
  if (free_selected.value && amount.value === 0) {
    console.log("free_selected! & free amount!");
    await user.Subscribe(free_selected.value);
    state.value = "done";
    return;
  } else if (free_selected.value === false && amount.value < 300) {
    console.log("no!");
    return;
  } else {
    const confirm = await stripe.ConfirmPayment();
    if (confirm) {
      let updateUser = false;
      let address = null;
      let updateStripe = false;
      try {
        if (!free_selected.value) {
          address = await stripe.GetAddress();
          console.log("Address:", address.address);
        }
        updateUser = await user.UpdateProfile({
          subscribed: true,
          subscription: free_selected.value ? "free" : "snail-mail",
          subscriptionId: subscriptionRef.value,
          customerId: customerId.value,
          donationAmount: amount.value,
          ...(address && {
            address: address.address,
            name: address.name,
          }),
        });
      } catch (error) {
        console.error("Error updating customer:", error);
        console.error("Failed to update profile");
      }
      if (updateUser) {
        try {
          updateStripe = await stripe.UpdateCustomer(
            customerId.value,
            address.address,
            address.name
          );
        } catch (error) {
          console.error("Error updating Stripe customer:", error);
          console.error("Failed to update Stripe customer");
        }
        if (updateStripe) {
          console.log("Customer updated successfully");
          state.value = "done";

          addressRef.value = null;
          paymentRef.value = null;
        } else {
          console.error("Failed to update Stripe customer");
        }
      } else {
        console.error("Failed som ewhere!");
      }
    }
  }
}

const login = ref(null);

const doSignUp = () => {
  login.value?.doSignUp();
};
const doLogin = () => {
  login.value?.toggleLogin();
};
</script>

<style scoped>
@import "@/assets/subscribe.css";

.page-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: auto;
}

.center {
  display: flex;
  justify-content: center;
}

button {
  margin: auto;
}

.container {
  display: flex;
  width: 80vw;
  margin: 0, auto;
  height: auto;
}

#flex-container {
  display: flex;
  width: 80%;
  height: 80vh;
  max-height: 50vw;
  margin: 0, auto;
}

.left {
  justify-content: center;
  display: flex;
  flex-direction: column;
  background-color: #4399cd;
  border-radius: 16px;
  width: fit-content;
  max-height: 100%;
  max-width: 50vw;
  margin: 1.5%;
  padding: 1.5%;
}

.right {
  width: 50vw;
  height: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.top-right {
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-height: 25%;
  border-radius: 16px;
  background-color: #ffffff;
  margin: 3%;
  padding-left: 3%;
  padding-right: 3%;
}

#top-right-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 50%;
}

#top-right-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 50%;
}

.bottom-right {
  max-height: 53%;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 16px;
  background-color: #8ee0ff;
  padding: 1.5%;
  margin: 1.5%;
}

#arrow {
  width: 30%;
  max-height: 40%;
  margin: auto;
}

#read {
  margin-top: 0%;
  max-height: 5%;
  font-size: 0.75rem;
}

.bottom-right-container {
  margin: auto;
  padding: 0%;
  height: 95%;
  justify-content: center;
  display: flex;
  flex-direction: row;
}

.card-container {
  position: relative;
  transition: transform 0.3s ease, z-index 0.1s ease;
  z-index: 1;
}

#periodical {
  margin: 0 auto;
  width: 75%;
  max-width: 45vh;
  height: auto;
  max-height: 50%;
  animation: floatUpDown2 1.5s ease-in-out infinite alternate;
}

.button-hover :deep(.image-button:hover) {
  transform: none !important;
}

.button-hover :deep(.vueButton img:hover),
.button-hover :deep(.vueButton p:hover),
.button-hover :deep(.vueButton h3:hover) {
  transition: transform 0.25s ease;
  transform: scale(1.1);
}

#subButton {
  margin: 0 auto;
  width: 55%;
  height: auto;
}

.text2 {
  margin: 0 auto;
  font-size: 1.4vw;
}

#TSBP1 {
  z-index: 3;
  width: 10vw;
  max-height: 90%;
  align-items: center;
}

#TSBP2 {
  z-index: 2;
  width: 10vw;
  max-height: 90%;
  align-items: center;
}

#TSBP3 {
  z-index: 1;
  width: 10vw;
  max-height: 90%;
  align-items: center;
}

.card-left {
  transform: rotate(-12.75deg);
  margin-right: -40%;
  margin-bottom: -5%;
}

.card-right {
  transform: rotate(12.75deg);
  margin-left: -40%;
  margin-bottom: -5%;
}

.card-right:hover {
  z-index: 3;
}

.card {
  border: 1px rgb(82, 51, 110) solid;
  border-radius: 0.25vw;
}

.readMe {
  position: relative;
  transition: transform 0.25s ease, top 0.25s ease;
  width: 75%;
  max-height: 25vh;
  margin-top: -15%;
  z-index: 3;
}

.card:hover + .readMe {
  transform: translateY(-4%);
  transform: scale(0.9);
}

#TSBP1:hover {
  z-index: 10;
}
#TSBP2:hover {
  z-index: 10;
}
#TSBP3:hover {
  z-index: 10;
}

#flex-container p {
  transition: transform 0.25s ease;
}

#question {
  margin: 0, auto;
  min-width: 50%;
  display: flex;
  justify-content: flex-start;
  animation: floatUpDown 1.5s ease-in-out infinite alternate;
  max-height: 100%;
}

#advice {
  width: 35%;
  max-height: 120%;
}

.text {
  white-space: pre-line;
  font-size: 1.2cqw;
}

#weekly-ish {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.text3 {
  margin: 0 auto;
}

#weekly {
  margin: 0 auto;
  width: 55%;
  max-height: 100%;
}

#mouse-alert {
  display: none;
  position: absolute;
  display: none;
  transform: translate(5%, -5%);
  background-color: yellow;
  padding: 5px;
  border: 1px solid black;
  z-index: 999;
}

@keyframes floatUpDown {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-3px);
  }
}

@keyframes floatUpDown2 {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(3px);
  }
}

input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  transition: border-color 0.2s;
}

#amount {
  width: 5vw;
}

input:focus {
  border-color: #0070f3;
  box-shadow: 0 0 0 2px rgba(141, 151, 255, 0.5);
  outline: none;
}

#signup-form {
  display: none;
}

#signup-form.active {
  display: block;
  margin: 5%;
}

#free-information {
  width: 45%;
}

#paid-information {
  width: 45%;
}

.information {
  width: 100%;
  font-size: 0.8rem;
  text-align: left;
}

.selector {
  position: absolute;
  width: 10%;
  margin-left: 7rem;
  z-index: 5;
  animation: floatUpDown 0.75s ease-in-out infinite alternate;
}
</style>
