// store/user.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loadStripe } from "@stripe/stripe-js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useStripe = defineStore("stripe", () => {
  const publicKey = ref(null);
  const stripe = ref(null);
  const elements = ref(null);
  const addressElement = ref(null);
  const paymentElement = ref(null);

  async function InitStripe() {
    try {
      const key = await FetchStripePublicKey();
      publicKey.value = key;
      stripe.value = await loadStripe(key);
    } catch (error) {
      console.error("Failed to initialize Stripe:", error);
    }
  }
  async function FetchStripePublicKey() {
    const response = await fetch(`${API_BASE_URL}/stripe-public-key`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.publicKey; // Ensure you're returning the public key
  }

  async function FetchClientSecret(amount) {
    const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency: "usd",
        paymentMethodType: "card",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Failed to retrieve client secret: " + errorText);
    }

    const { clientSecret } = await response.json();
    if (!clientSecret) throw new Error("Failed to retrieve client secret");
    return clientSecret;
  }

  async function MountElements(clientSecret, addressTarget, paymentTarget) {
    if (!stripe.value) throw new Error("Stripe not initialized");
    elements.value = stripe.value.elements({ clientSecret });
    if (addressTarget) {
      addressElement.value = elements.value.create("address", {
        mode: "shipping",
      });
      addressElement.value.mount(addressTarget);
    }
    paymentElement.value = elements.value.create("payment");
    paymentElement.value.mount(paymentTarget);
  }

  async function ConfirmPayment() {
    console.log("paying...");
    if (!stripe.value || !elements.value) throw new Error("Stripe not ready");
    const { error } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {},
      redirect: "if_required",
    });

    if (error) {
      return { success: false, error: error.message };
    } else {
      return { success: true };
    }
  }

  async function CreateCustomer(email, name) {
    if (!email) {
      return { success: false, error: "Email is required" };
    }
    //console.log('Completed address data:', addressData);
    console.log("Name:", name);
    const response = await fetch(`${API_BASE_URL}/create-customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        //    address: addressData,
      }),
    });
    if (!response.ok) {
      let error;
      try {
        error = await response.json();
      } catch (e) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }
      const err =
        error.error ||
        error.message ||
        `Server error with status ${response.status}`;
      throw new Error(err);
    }

    const customer = await response.json();
    if (customer.success && customer.customer) {
      return { success: true, customer: customer.customer };
    } else {
      return {
        success: false,
        error:
          `${customer.error}\n ${customer.message}` ||
          "Stripe returned no customer.",
      };
    }
  }

  async function UpdateCustomer(customerId, addressData, nameData) {
    try {
      const response = await fetch(`${API_BASE_URL}/update-customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
          address: addressData,
          name: nameData,
        }),
      });

      if (!response.ok) throw new Error("Failed to update Stripe customer");

      return true;
    } catch (error) {
      console.error("UpdateCustomer failed:", error);
      return false;
    }
  }

  async function Subscribe(amount, customer) {
    console.log("Customer data:", customer);
    console.log("amount:", amount);
    try {
      const response = await fetch(`${API_BASE_URL}/create-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_amount: amount,
          customer: customer,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to create sub: ${response.statusText}`);
      }
      const subscription = await response.json();

      if (subscription.success && subscription.subscriptionId) {
        return {
          success: true,
          subscriptionId: subscription.subscriptionId,
          clientSecret: subscription.clientSecret,
        };
      } else {
        return { success: false, error: "Invalid subscription data returned" };
      }
    } catch (error) {
      console.error("Error during customer creation:", error);
      // Handle the error appropriately, maybe show a message to the user
    }
  }

  async function GetAddress() {
    if (!addressElement.value) return null;
    const result = await addressElement.value.getValue();
    if (result.complete) {
      return result.value;
    } else {
      return null;
    }
  }

  return {
    publicKey,
    stripe,
    InitStripe,
    FetchStripePublicKey,
    FetchClientSecret,
    MountElements,
    ConfirmPayment,
    CreateCustomer,
    UpdateCustomer,
    Subscribe,
    GetAddress,
  };
});
