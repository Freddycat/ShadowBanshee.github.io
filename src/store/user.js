// store/user.js
import { defineStore } from "pinia";
import {
  useFirebaseAuth,
  useFirestore,
  useCurrentUser,
  useDocument,
  useCollection,
} from "vuefire";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  collection,
  getFirestore,
  query,
  orderBy,
} from "firebase/firestore";

import { ref, computed } from "vue";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useUser = defineStore("user", () => {
  const vueAuth = useFirebaseAuth();
  const vueUser = useCurrentUser();
  const vueFS = useFirestore();
  const fs = getFirestore();
  const auth = getAuth();
  const profileRef = computed(() =>
    vueUser.value?.uid ? doc(fs, "users", vueUser.value.uid) : null
  );

  const profile = useDocument(profileRef);
  const userEmail = computed(() => vueUser.value?.email);
  const username = computed(() => profile.data.value?.username);
  const uid = computed(() => vueUser.value?.uid);
  const isLoggedIn = computed(() => !!vueUser.value);
  const isVerified = computed(() => vueUser.value?.emailVerified === true);
  const subscribed = computed(() => profile.data.value?.subscribed);
  const subscription = computed(() => profile.data.value?.subscription);

  const customerId = computed(() => profile.data.value?.customerId);
  const subscriptionId = computed(() => profile.data.value?.subscriptionId);

  // Lookup the user associated with the specified uid.
  async function getAdmin() {
    while (!uid.value) {
      await new Promise((r) => setTimeout(r, 100));
    }
    console.log("UID before fetch:", uid.value);
    const admin = await fetch(`${API_BASE_URL}/check-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: uid.value }),
    });
    if (!admin.ok) {
      console.error("Failed to fetch admin data:", await admin.json());
      throw new Error(`Failed to fetch admin data: ${admin.statusText}`);
    } else {
      const data = await admin.json();
      console.log("Admin data fetched successfully:", data);
      return { data: data, success: true };
    }
  }

  const donationAmount = computed(() =>
    (profile.data.value?.donationAmount / 100).toFixed(2)
  );

  const user = ref(auth.currentUser);

  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      try {
        await currentUser.getIdToken();
      } catch (err) {
        console.warn("Stale session, signing out");
        auth.signOut();
      }
    }
  });

  async function Login(identifier, password) {
    try {
      console.log(API_BASE_URL);
      let email = identifier;
      if (!identifier.includes("@")) {
        console.log(
          'Identifier does not include "@", attempting username lookup.'
        );
        email = await GetEmail(email);
        if (!email) {
          console.error("User not found:", Error.message);
          throw new Error(
            `User "${identifier}" not found, did you mean something else?`
          );
        }
        identifier = email;
      }
      await signInWithEmailAndPassword(vueAuth, identifier, password);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  async function GetEmail(username) {
    try {
      console.log("Fetching email for username:", username);
      //const response = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/get-email', {
      const response = await fetch(
        "http://127.0.0.1:5001/shadowbanshee-79c70/us-central1/api/get-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        console.error("Server response:", await response.json());
        console.log("Response status:", response.status);
        console.log("Response status:", response);
        console.error(
          "Failed to fetch email from server:",
          response.statusText
        );
        throw new Error("Failed to fetch email from server");
      }

      const data = await response.json();
      console.log("Fetched email:", data.email);
      return data.email;
    } catch (error) {
      console.error("Error fetching email from server:", error);
      return null;
    }
  }

  async function Logout() {
    // The action accepts the credentials as arguments

    try {
      console.log("Logging out");
      await vueAuth.signOut();
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  }

  async function SignUp(username, email, password) {
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/shadowbanshee-79c70/us-central1/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );
      // trying to add custom token signin here
      const data = await response.json();

      if (!response.ok) {
        console.error("Server response:", data);
        const errorMessage = data.error || "Signup failed on the server.";
        throw new Error(errorMessage);
      }

      await signInWithCustomToken(auth, data.token);

      return data;
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  }

  async function CheckUsername(username) {
    try {
      console.log("Checking username:", username);
      const response = await fetch(`${API_BASE_URL}/check-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        console.error("Server response:", await response.json());
        console.log("Response status:", response.status);
        console.log("Response status:", response);
        console.error("Failed to check username:", response.statusText);
        throw new Error("Failed to check username!");
      }

      const data = await response.json();
      console.log("Fetched username:", data.exists);
      return data;
    } catch (error) {
      console.error("Error fetching username from server:", error);
      return null;
    }
  }
  async function CheckEmail(email) {
    try {
      console.log("Checking email:", email);
      const response = await fetch(`${API_BASE_URL}/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.error("Server response:", await response.json());
        console.log("Response status:", response.status);
        console.log("Response status:", response);
        console.error("Failed to check email:", response.statusText);
        throw new Error("Failed to check email!");
      }

      const data = await response.json();
      console.log("Fetched email:", data.exists);
      return data;
    } catch (error) {
      console.error("Error fetching email from server:", error);
      return null;
    }
  }

  onAuthStateChanged(auth, async (authUser) => {
    user.value = authUser;
    if (authUser) {
      if (authUser.emailVerified) {
        const userRef = doc(fs, "users", authUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && !userSnap.data().verified) {
          try {
            await updateDoc(userRef, {
              verified: true,
            });
            isVerified.value = true;
            console.log("User Firestore updated for email verification.");
          } catch (error) {
            console.error("Error updating user Firestore:", error);
          }
        }
      }
    }
  });

  async function UpdateProfile(data) {
    if (!user.value) throw new Error("User is not logged in");
    try {
      await updateDoc(profileRef.value, data);
      Object.assign(profile.value, data);
      return true;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      return false;
    }
  }

  async function Subscribe(free, name, amount) {
    console.log("Creating subscription. free:", free, amount, name);
    if (free) {
      setDoc(
        profileRef.value,
        {
          subscribed: true,
          subscription: "free",
          donationAmount: 0,
        },
        { merge: true }
      );
    } else if (amount >= 299) {
      console.log("Creating subscription for amount:", amount);
      console.log("Creating subscription for name:", name);
      const customer = await create(name);
      if (customer.success) {
        const subscription = await subscribe(amount, customer.customer);
        if (subscription.success) {
          console.log("Subscription created successfully:", subscription);
          setDoc(
            profileRef.value,
            {
              subscribed: true,
              subscription: "snail-mail",
              donationAmount: amount,
              customerId: customer.customer,
            },
            { merge: true }
          );
          return {
            success: true,
            subscriptionId: subscription.subscriptionId,
            clientSecret: subscription.clientSecret,
          };
        } else {
          console.error("Failed to create subscription:", subscription.error);
        }
      }
    }
  }

  async function Unsubscribe() {
    console.log("Unsubscribing user");

    if (user.subscription === "free") {
      console.log("free");
      setDoc(
        profileRef.value,
        {
          subscribed: false,
          subscription: null,
          donationAmount: 0,
        },
        { merge: true }
      );
      return;
    }
  }

  async function EditSub(amount, downgrade, cancel) {
    console.log("Editing:", amount);
    if (amount >= 299) {
      console.log("Editing:", amount, customerId.value, subscriptionId.value);
      const response = await fetch(`${API_BASE_URL}/edit-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: "usd",
          unit_amount: amount,
          customerId: customerId.value,
          subscriptionId: subscriptionId.value,
        }),
      });
      if (!response.ok) {
        console.error("Server response:", await response.json());
        console.log("Response status:", response.status);
        console.log("Response status:", response);
        console.error("Failed to edit subscription:", response.statusText);
        throw new Error("Failed to edit subscription!");
      }
      const data = await response.json();
      if (data.success) {
        console.log("Subscription edited successfully:", data);
        setDoc(
          profileRef.value,
          {
            donationAmount: amount,
          },
          { merge: true }
        );
        return {
          success: true,
        };
      } else {
        return { success: false, error: "Error!" };
      }
    }
  }

  async function DeleteAccount(uid) {
    try {
      console.log("Deleting account for user:", uid);
      const response = await fetch(`${API_BASE_URL}/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server response:", data);
        const errorMessage =
          data.message || data.errorMessage || "Delete failed on the server.";
        throw new Error(errorMessage);
      }
      console.log("Account deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  }

  const posts = useCollection(
    query(collection(fs, "weeklyPosts"), orderBy("createdAt", "desc"))
  );

  const loading = ref(false);
  const error = ref(null);

  // Return the state and actions
  return {
    vueAuth,
    vueUser,
    vueFS,
    userEmail,
    user,
    uid,
    username,
    profile,
    isLoggedIn,
    isVerified,
    subscribed,
    subscription,
    donationAmount,
    posts,
    loading,
    error,
    getAdmin,
    Login,
    Logout,
    SignUp,
    CheckUsername,
    CheckEmail,
    Subscribe,
    Unsubscribe,
    EditSub,
    UpdateProfile,
    DeleteAccount,
  };
});
