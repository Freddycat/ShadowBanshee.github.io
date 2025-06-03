<template>
  <Modal isOverlay class="signup-modal">
    <Button isX @click="$emit('close')" />
    <form
      v-if="!signedUp"
      @submit.prevent="doSignUp"
      class="create-account-form"
    >
      <p>
        We don't have access to your password and it secured via Google
        Firebase! You will receive an Email to verify your account. :)
      </p>

      <div class="input">
        <input
          v-model="username"
          @blur="checkUsername"
          type="text"
          placeholder="Username"
          required
        />
        <p v-if="checkedUsername">{{ usernameResponse }}</p>
      </div>

      <div class="input">
        <input
          v-model="email"
          @blur="checkEmail"
          type="email"
          placeholder="Email"
          required
        />
        <p v-if="checkedEmail">{{ emailResponse }}</p>
      </div>

      <div class="input">
        <input
          v-model="password"
          @blur="checkPassword"
          type="password"
          placeholder="Password"
          required
        />
        <p v-if="checkedPassword">{{ passwordResponse }}</p>
      </div>

      <div class="input">
        <input
          v-model="passwordDbl"
          @blur="dblCheck"
          type="password"
          placeholder="Double check password!"
          required
        />
        <p v-if="dblChecked">{{ passwordDblResponse }}</p>
      </div>

      <div class="input">
        <Button class="submit-button" type="submit">Create Account! -></Button>
        <img
          v-if="isLoading"
          src="@/assets/images/gif.gif"
          alt="Loading..."
          style="width: 4em; margin: -1.4vw"
        />
        <p id="error-message">{{ errorMessage }}</p>
      </div>
    </form>
    <div v-if="signedUp" style="margin: 5vw">
      <p v-if="!user.isVerified" style="margin-bottom: 1vw">
        Created account successfully! A validation link has been sent to your
        email address. :)
      </p>
      <p>
        (Didn't get it?
        <a href="#" @click.prevent="resend">Click here to resend!</a>)
      </p>
    </div>
    <img v-if="isLoading" class="loading" src="@/assets/images/gif.gif" />
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Button from "../Button.vue";
import Modal from "../Modal.vue";
import { useUser } from "@/store/user";
import { storeToRefs } from "pinia";
import { useAlert } from "@/utils/alert";

const alert = useAlert();

const user = useUser();

const { isLoggedIn } = storeToRefs(user);

const isLoading = ref(false);
const signedUp = ref(false);

const username = ref("");
const email = ref("");
const password = ref("");
const passwordDbl = ref("");

const usernameResponse = ref("");
const emailResponse = ref("");
const passwordResponse = ref("");
const passwordDblResponse = ref("");

const checkedUsername = ref(false);
const checkedEmail = ref(false);
const checkedPassword = ref(false);
const dblChecked = ref(false);

const error = ref(false);
const errorMessage = ref("");

const checkUsername = async () => {
  if (!username.value) return;
  checkedUsername.value = true;
  try {
    const data = await user.CheckUsername(username.value);
    if (data.exists) {
      usernameResponse.value = "\u00A0✗ Username is already taken!";
      return false;
    } else {
      usernameResponse.value = "\u00A0✓ Good!";
      return true;
    }
  } catch (err) {
    usernameResponse.value = "\u00A0✗ Error checking username.";
  }
};

const checkEmail = async () => {
  if (!email.value) return;
  checkedEmail.value = true;
  try {
    const data = await user.CheckEmail(email.value);
    if (data.exists) {
      emailResponse.value = "\u00A0✗ Email is already registered!";
      return false;
    } else {
      emailResponse.value = "\u00A0✓ Good!";
      return true;
    }
  } catch (err) {
    emailResponse.value = "\u00A0✗ Error checking email.";
  }
};

const checkPassword = async () => {
  if (!password.value) return;
  checkedPassword.value = true;
  if (password.value.length < 6) {
    passwordResponse.value =
      "\u00A0✗ Use at least 6 numbers, letters or characters!";
    return false;
  } else {
    passwordResponse.value = "\u00A0✓ Good!";
    return true;
  }
};
const dblCheck = async () => {
  if (!passwordDbl.value) return;
  dblChecked.value = true;
  if (passwordDbl.value != password.value) {
    passwordDblResponse.value = "\u00A0✗ Passwords don't match!";
    return false;
  } else {
    passwordDblResponse.value = "\u00A0✓ Good!";
    return true;
  }
};

async function doSignUp() {
  isLoading.value = true;
  error.value = true;
  errorMessage.value = "...";
  console.log("Signing up...", username.value, email.value, password.value);

  const validUsername = await checkUsername();
  const validEmail = await checkEmail();
  const validPassword = await checkPassword();
  const validDbl = await dblCheck();
  const simulateLag = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  if (!validUsername || !validEmail || !validPassword || !validDbl) {
    await simulateLag(2000);
    errorMessage.value = "Please fix the errors above before submitting.";
    console.log("Signup Failed.");
    errorMessage.value = "\u00A0✗ Check fields!";
    alert(errorMessage.value, "error", 3000);
    isLoading.value = false;
    return;
  }

  try {
    const result = await user.SignUp(
      username.value,
      email.value,
      password.value
    );
    if (result) {
      console.log(
        "Created account successfully! An email has been sent to your address. :)"
      );
      alert(
        "Created account successfully! An email has been sent to your address. :)",
        "success",
        3000
      );
      errorMessage.value = "Success!";
      isLoading.value = false;
      signedUp.value = true;
    } else {
      console.log("Signup Failed.");
      errorMessage.value = "Signup Failed:";
      alert(errorMessage.value, "error", 3000);
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error signing up:", error);
    errorMessage.value = "Error signing up: " + error.message;
    alert(errorMessage.value, "error", 3000);
    isLoading.value = false;
  } finally {
    console.log(isLoggedIn.value);
    isLoading.value = false;
  }
}
</script>

<style scoped>
p {
  margin: 0;
}

.signup-modal {
  height: min-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  color: black;
}

.create-account-form {
  width: 70%;
  padding: 1.2vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.create-account-form > * {
  padding: 0.4vw;
}

.loading {
  position: relative;
  width: 25%;
}
.input {
  display: flex;
  flex-direction: row;
  font-size: 0.8rem;
  align-items: center;
}
.submit-button {
  margin: 1vw;
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
