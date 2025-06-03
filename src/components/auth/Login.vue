<template>
  <SignUp v-if="isSignUp" @close="isSignUp = false" />

  <Button @click="isLogin = true" id="login-button">
    <p v-if="!user.isLoggedIn">Login</p>
    <p v-if="user.isLoggedIn">Account</p>
  </Button>

  <transition name="Slide">
    <Modal class="login-sidebar slide-in-done" v-if="isLogin">
      <Button @click="isLogin = false" isX></Button>
      <div class="login">
        <form v-if="!isLoggedIn" id="login-form" @submit.prevent="doLogin">
          <p>Log in:</p>
          <input
            v-model="identifier"
            type="text"
            id="login-username-email"
            placeholder="Username or Email"
            required
          />
          <input
            v-model="password"
            type="password"
            id="login-password"
            placeholder="Password"
            required
          />
          <Button
            type="submit"
            customClass="submit-button"
            :disabled="isLoading"
          >
            {{ isLoading ? "Logging In..." : "Login" }}
          </Button>
        </form>

        <div v-if="isLoggedIn">
          <p style="padding: 0; margin: 0.4vw">Logged in!</p>
          <h3 style="padding: 0; margin: 0.4vw">{{ username }}</h3>
          <p style="padding: 0; margin: 0.4vw">{{ userEmail }}</p>
          <div v-if="!user.isVerified">
            <p>You are not verified!</p>
            <a href="#">Resend verification?</a>
            <p>Put the wrong email? You can change it in account:</p>
          </div>
          <Button class="controls" isRouter to="/account">Account</Button>
          <Button class="controls" @click="doLogout">Logout</Button>
        </div>
        <p v-if="error" id="error-message">{{ errorMessage }}</p>
        <img
          v-if="isLoading"
          id="loading"
          src="@/assets/images/gif.gif"
          alt=""
        />
      </div>
      <div v-if="!isLoggedIn" id="sign-up">
        <span>Don't have an account? Create one!</span>
        <Button @click="doSignUp" id="signup-button" class="nav-button"
          >Sign Up</Button
        >
      </div>
    </Modal>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import SignUp from "./SignUp.vue";
import Button from "../Button.vue";
import Modal from "../Modal.vue";
import { useUser } from "@/store/user";
import { storeToRefs } from "pinia";
import { useAlert } from "@/utils/alert";

const alert = useAlert();

const user = useUser();

const { isLoggedIn, username, userEmail } = storeToRefs(user);

const isLogin = ref(false);
const isLoading = ref(false);
const isSignUp = ref(false);

const identifier = ref("");
const password = ref("");

const error = ref(false);
const errorMessage = ref("");

const toggleLogin = () => {
  console.log("Loggin clicked...");
  isLogin.value = !isLogin.value;
  console.log("logged?", isLoggedIn.value);
};

async function doLogin() {
  isLoading.value = true;
  error.value = true;
  errorMessage.value = "Logging in...";
  console.log("Logging in...");
  try {
    const result = await user.Login(identifier.value, password.value);

    if (result) {
      console.log("Login successful and user data updated.");
      alert("Logged in!", "success", 3000);
      error.value = false;
      isLoading.value = false;
    } else {
      console.log("Login failed.");
      errorMessage.value = "Login failed! Check info?";
      alert(errorMessage.value, "error", 3000);
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error logging in:", error);
    errorMessage.value = "Error logging in: " + error.message;
    alert(errorMessage.value, "error", 3000);
    isLoading.value = false;
  } finally {
    console.log(isLoggedIn.value);
    isLoading.value = false;
  }
}

async function doLogout() {
  isLoading.value = true;
  error.value = true;
  errorMessage.value = "Logging out...";
  console.log("Logging out...");
  try {
    const result = await user.Logout();
    console.log("Logout successful.");
    isLoading.value = false;
    if (result) {
      console.log("Logout successful.");
      alert("Logged out!", "success", 3000);
      errorMessage.value = "";
      isLoading.value = false;
    } else {
      console.log("Logout failed.");
      errorMessage.value = "Logout failed.";
      alert(errorMessage.value, "error", 3000);
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error signing out:", error);
    errorMessage.value = "Error signing out: " + error.message;
    alert(errorMessage.value, "error", 3000);
    isLoading.value = false;
  } finally {
    console.log(isLoggedIn.value);
    isLoading.value = false;
  }
  console.log("Logged out");
}

async function doSignUp() {
  isSignUp.value = true;
  isLogin.value = false;
}

defineExpose({ doSignUp, toggleLogin });
</script>

<style scoped>
p {
  padding: 0;
  margin: 0;
}

#login-button {
  position: fixed;
  top: 1.8vw;
  right: 1.8vw;
  color: #ffffff;
  cursor: pointer;
}

#close-button {
  position: fixed;
}

.login-sidebar {
  display: block;
  top: 1vw;
  height: fit-content;
  min-height: 200px;
  width: 320px;
  max-width: 90%;
  padding: 1vw;
  color: black;
  background-color: #ffffff;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 1vw;
  flex-direction: column;
  overflow: auto;
}

.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

#login-form {
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
}
#login-form > * {
  margin: 0.4vw;
}

.submit-button {
  width: 22%;
}

#signup-button {
  width: 25%;
  margin: 0.4vw;
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

.controls {
  margin: 0.4vw;
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
