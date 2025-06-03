<template>
  <div class="home">
    <Alert ref="alertRef" />
    <Header v-if="!isLoggedIn" />
    <Modal v-if="!isLoggedIn" isOverlay class="deleted">
      <p>Account successfully deleted!</p>
    </Modal>
    <Modal v-if="isLoggedIn" isOverlay class="page-content">
      <Header />
      <div id="account-info">
        <p>
          Username: <span id="account-username">{{ user.username }}</span>
        </p>
        <p>
          Email: <span id="account-email">{{ user.userEmail }}</span>
        </p>
      </div>
      <div v-if="!user.isVerified">
        <Button v-if="!editingUser" @click="editingUser = true">Edit</Button>
        <div
          v-if="editingUser"
          id="edit-user"
          style="display: flex; flex-direction: column"
        >
          <p>Edit your account:</p>
          username:<input type="text" name="username" id="username" />
          email:<input type="text" name="email" id="email" />
          <Button
            @click="editingUser = false"
            style="margin-top: 1vw; margin-bottom: 1vw"
            >Cancel</Button
          >
        </div>
      </div>

      <Button v-if="!editingUser" @click="doLogout">Log out</Button>
      <p v-if="!user.isVerified">
        Need to <a href="#" @click.prevent="resend">resend Verification?</a>
      </p>

      <div id="subscriptions">
        <h3>Subscriptions</h3>
        <div id="subscription-list">
          <div v-if="!user.subscribed" id="unsubscribed">
            <p>You are not subscribed to any newsletters.</p>
            <p>
              Check out the
              <RouterLink to="/periodical"
                >Shadow Banshee Periodical</RouterLink
              >
              page!
            </p>
          </div>

          <div v-if="user.subscription === 'free'" id="subscribed-free">
            <p>Subscription Type: Free Cyber Teir!</p>
            <h3>Amount: $0/monthly</h3>
            <p>You can subscribe to the Snail-Mail teir at any time!</p>
            <p>Or, Unsubscribe:</p>
            <Button @click="doUnsubscribe" class="unsubscribe-button"
              >Unsubscribe</Button
            >
          </div>

          <div v-if="user.subscription === 'snail-mail'" id="subscribed-paid">
            <p>Subscription Type: {{ user.subscription }}!</p>
            <h3>Amount: $ {{ user.donationAmount }} /monthly</h3>
            <p>You can edit or cancel your Stripe subscription at any time!</p>
            <p>Price changes or cancelations happen next billing cycle,</p>
            <p>and can always be edited or re-instated.</p>
            <h3>Edit your subscription:</h3>
            <Button v-if="!editing" @click="editing = true" id="edit-button"
              >Edit Subscription</Button
            >
            <Button v-if="!editing" class="unsubscribe-button"
              >Unsubscribe</Button
            >
          </div>

          <div
            v-if="editing"
            id="input-area"
            style="border: 1px solid black; border-radius: 1vw; padding: 1vw"
          >
            <Button @click="editing = false" style="margin-bottom: 1vw"
              >Cancel</Button
            >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
              "
            >
              <div
                v-if="!cancel"
                style="display: flex; flex-direction: row; margin-bottom: 1vw"
              >
                <label for="downgrade">Downgrade to Free? (Cyber Tier)</label>
                <input
                  v-model="downgrade"
                  :true-value="true"
                  :false-value="false"
                  name="downgrade"
                  type="checkbox"
                />
              </div>
              <div
                style="display: flex; flex-direction: row; margin-bottom: 3vw"
              >
                <label for="cancel">Cancel completely?</label>
                <input
                  v-model="cancel"
                  :true-value="true"
                  :false-value="false"
                  name="cancel"
                  type="checkbox"
                />
              </div>
              <div v-if="!cancel">
                <label for="amount">Amount: $</label>
                <input
                  @blur="amountBlur"
                  v-model="input"
                  name="amount"
                  id="amount"
                  type="number"
                  min="3"
                  max="10"
                />
              </div>
              <div v-if="error">
                <p>{{ errorMessage }}</p>
              </div>
              <div v-if="cancel">
                <p>
                  Canceling will completely unsubscribe you from all emails and
                  will cancel your stripe subscription at the end of the cycle!
                </p>
                <p>
                  You can always re-subscribe, but you can't delete your account
                  until the end of the cycle.
                </p>
              </div>
            </div>
            <Button @click="doEdit" style="margin-top: 1vw"
              >Save Changes</Button
            >

            <div v-if="amount_error" id="amount-message">
              {{ amount_message }}
            </div>
          </div>

          <div id="canceled" style="display: none">
            <p>
              Your Paid subscription is canceled but still active until
              <span id="cancel-date"></span>.
            </p>
            <Button id="reactivate-button" class="nav-button"
              >Reactivate Subscription</Button
            >
          </div>
        </div>
      </div>

      <h3>↓You can scroll down to delete your account↓</h3>

      <Button
        @click="doDelete"
        id="delete-account-button"
        style="background-color: red"
        >Delete Account</Button
      >
      <p v-if="error" id="error-message">{{ errorMessage }}</p>
    </Modal>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import Modal from "../components/Modal.vue";
import Button from "../components/Button.vue";
import Alert from "../components/Alert.vue";
import { useUser } from "@/store/user";
import { ref, watch, computed, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAmount } from "@/utils/amount";
import { useAlert } from "@/utils/alert";

const alert = useAlert();
const { input, amount, amount_error, amount_message, amountBlur } = useAmount();
const router = useRouter();
const user = useUser();
const { isLoggedIn } = storeToRefs(user);
const isLoading = ref(false);
const error = ref(false);
const errorMessage = ref("");

const editingUser = ref(false);

const editing = ref(false);
const downgrade = ref(false);
const cancel = ref(false);

async function doDelete() {
  isLoading.value = true;
  error.value = true;
  errorMessage.value = "...";
  console.log("Is logged in?", isLoggedIn);
  console.log("Deleting account...", user.uid);
  try {
    const result = await user.DeleteAccount(user.uid);

    if (result) {
      console.log("Deleted successfully! :)");
      alert("Deleted successfully! :)", "success", 3000);
      errorMessage.value = "Success!";
      isLoading.value = false;
      await user.Logout();
    } else {
      console.log("Delete Failed.");
      errorMessage.value = "Delete Failed:";
      alert(errorMessage.value, "error", 3000);
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error Deleting:", error);
    errorMessage.value = "Error Deleting: " + error.message;
    alert(errorMessage.value, "error", 3000);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
}

function doLogout() {
  isLoading.value = true;
  error.value = true;
  errorMessage.value = "...";
  console.log("Logging out...");
  try {
    user.Logout();
    isLoading.value = false;
    router.push({ name: "home" }).then(() => {
      nextTick(() => {
        console.log("Logged out successfully.");
        alert("Logged out successfully.", "success", 3000);
      });
    });
  } catch (error) {
    console.error("Error logging out:", error);
    errorMessage.value = "Error logging out: " + error.message;
    alert(errorMessage.value, "error", 3000);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
}

async function doEdit() {
  try {
    const result = await user.EditSub(
      amount.value,
      downgrade.value,
      cancel.value
    );

    if (result.success) {
      console.log("Edited successfully! :)");
      alert("Edited successfully! :)", "success", 3000);
      isLoading.value = false;
    } else {
      console.log("Edit Failed.");
      errorMessage.value = "Edit Failed:";
      alert(errorMessage.value, "error", 3000);
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error Editing:", error);
    errorMessage.value = "Error Editing: " + error.message;
    alert(errorMessage.value, "error", 3000);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
}

async function doUnsubscribe() {
  isLoading.value = true;
  error.value = true;
  errorMessage.value = "...";
  try {
    const result = await user.Unsubscribe(user.uid);

    if (result) {
      console.log("Deleted successfully! :)");
      alert("Deleted successfully! :)", "success", 3000);
      errorMessage.value = "Success!";
      isLoading.value = false;
      await user.Logout();
    } else {
      console.log("Delete Failed.");
      errorMessage.value = "Delete Failed:";
      alert(errorMessage.value, "error", 3000);
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error Deleting:", error);
    errorMessage.value = "Error Deleting: " + error.message;
    alert(errorMessage.value, "error", 3000);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
:deep(.header) {
  width: 35vw;
}

:deep(.title) {
  padding-top: 4vh;
  width: 70%;
}
.page-content {
  padding: 3vw;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.deleted {
  left: 50%;
  transform: translate(-50%, 50%);
  width: 90%;
  padding: 3vw;
  color: black;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
}

#subscriptions {
  padding: 3%;
  margin: auto;
  border: solid 1px rgba(0, 0, 0, 0.315);
  border-radius: 1vw;
  max-width: 68vw;
}
</style>
