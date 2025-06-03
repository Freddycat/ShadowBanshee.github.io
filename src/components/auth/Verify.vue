<template>
  <div class="home">
    <Header />
    <NavBar v-if="user.isLoggedIn" />
    <Login />
    <div class="page-content">
      <Modal class="login-modal">
        <div style="display: flex; flex-direction: column">
          <form
            v-if="!user.isLoggedIn"
            @submit.prevent="doLogin"
            class="login-form"
          >
            <p>&nbsp;✓ You've been Verified! Sign in. :)</p>
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
              customClass="submitButton"
              :disabled="isLoading"
            >
              {{ isLoading ? "Logging In..." : "Login" }}
            </Button>
          </form>
          <div
            style="display: flex; justify-content: center; align-items: center"
            v-if="user.isLoggedIn"
          >
            <div id="logged-in">
              <h3>&nbsp;✓ You are logged in!</h3>
              <p>
                Feel free to check out the<br />
                Periodical page to subscribe to<br />
                <RouterLink to="/periodical"
                  >the Shadow Banshee Periodical,</RouterLink
                >
                read the<br />
                <RouterLink to="/weekly">weekly-ish Banshee,</RouterLink><br />
                and more!
              </p>
            </div>
          </div>
          <p v-if="error" id="error-message">{{ errorMessage }}</p>
        </div>
        <img
          v-if="isLoading"
          id="loading"
          src="@/assets/images/gif.gif"
          alt=""
          style="width: 24%"
        />
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "../Button.vue";
import Modal from "../Modal.vue";
import Header from "../Header.vue";
import NavBar from "../NavBar.vue";
import Login from "./Login.vue";
import { useUser } from "@/store/user";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAlert } from "@/utils/alert";

const alert = useAlert();

const user = useUser();

const isLoading = ref(false);
const identifier = ref("");
const password = ref("");

const error = ref(false);
const errorMessage = ref("");

async function doLogin() {
  isLoading.value = true;
  error.value = true;
  errorMessage.value = "Logging in...";
  console.log("Logging in...");
  try {
    const result = await user.Login(identifier.value, password.value);

    if (result) {
      isLoading.value = false;
      console.log("Login successful and user data updated.");
      alert("Logged in!", "success", 3000);
      errorMessage.value = "";
    } else {
      console.log("Login failed.");
      errorMessage.value = "Login failed. Please check your credentials.";
      alert(errorMessage.value, "error", 3000);
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error signing in:", error);
    errorMessage.value = "Error signing in: " + error.message;
    alert(errorMessage.value, "error", 3000);
    isLoading.value = false;
  } finally {
    console.log(isLoggedIn.value);
    isLoading.value = false;
  }
}
</script>

<style scoped>
.page-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-modal {
  margin: 0, auto;
  width: 90%;
  margin-top: 3vw;
  max-width: 800px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: aliceblue;
  color: black;
}

.login-form {
  padding: 1vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.submitButton {
  width: 24%;
  margin: 0%;
  margin-top: 1%;
}

#logged-in {
  width: 90%;
}

#error-message {
  margin: 3vw;
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
