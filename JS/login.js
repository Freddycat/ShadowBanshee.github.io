import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDocs, query, collection, where } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("login-button");
    const loginSidebar = document.getElementById("login-sidebar");
    const loginForm = document.getElementById("login-form");
    const accountInfo = document.getElementById("account-info");
    const accountButton = document.getElementById("account-button");
    const logoutButton = document.getElementById("logout-button");
    const signupButton = document.getElementById("sign-up");
    const closeModal = document.getElementsByClassName("close")[0];
    const createAccount = document.getElementById("create-account");
    const createAccountForm = document.getElementById("create-account-form");
    const messageElement = document.getElementById("error-message");
    const loading = document.getElementById("loading");
    const accountLoading = document.getElementById("account-loading");
    createAccount.style.display = "none";
    loading.style.display = "none";
    accountLoading.style.display = "none";

    function toggleLogin() {
        loginSidebar.classList.toggle("active");
        updateLoginButtonText();
    }

    function updateLoginButtonText() {
        if (loginSidebar.classList.contains("active")) {
            loginButton.textContent = "X";
        } else {
            loginButton.textContent = auth.currentUser ? "Account" : "Login";
        }
    }

    function updateUI(user) {
        if (user) {
            loginForm.style.display = "none";
            accountInfo.style.display = "block";
            logoutButton.style.display = "block";
            signupButton.style.display = "none";
            accountButton.style.display = "block";
            document.getElementById("account-username").textContent = user.email;
        } else {
            loginForm.style.display = "block";
            accountInfo.style.display = "none";
            logoutButton.style.display = "none";
            signupButton.style.display = "block";
            accountButton.style.display = "none";
        }
        updateLoginButtonText();
    }

    onAuthStateChanged(auth, (user) => {
        updateUI(user);
        if (user) {
            console.log('User signed in:', user);
            setAlert('Logged in!', 'info', 1500);
        } else {
            console.log('User signed out');
        }
    });

    loginButton.addEventListener("click", toggleLogin);

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const identifier = document.getElementById("login-username-email").value;
        const password = document.getElementById("login-password").value;
        loading.style.display = 'block';

        try {
            let email = identifier;

            if (!identifier.includes('@')) {
                email = await getEmail(identifier);
                if (!email) {
                    throw new Error(`User "${identifier}" not found, did you mean something else?`);
                }
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User signed in:', userCredential.user);
            loginSidebar.classList.remove("active");
            updateUI(userCredential.user);
            setAlert('Signed in!', 'success', 3000);
        } catch (error) {

            // Check for specific error messages and handle accordingly
            if (error.code === 'auth/user-not-found') {
                messageElement.textContent = `User "${identifier}" not found.`;
            } else if (error.code === 'auth/wrong-password') {
                messageElement.textContent = 'Incorrect password. Please try again.';
            } else {
                messageElement.textContent = error.message; // Default error message
            }

            messageElement.style.display = 'block'; // Show the error message
            console.error('Error signing in:', error);
        }
        loading.style.display = 'none';
    });

    async function getEmail(username) {
        try {
            const response = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/get-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                console.error('Server response:', await response.json());
                throw new Error('Failed to fetch email from server');
            }

            const data = await response.json();
            return data.email;
        } catch (error) {
            console.error('Error fetching email from server:', error);
            return null;
        }
    }

    createAccountForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const username = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        accountLoading.style.display = 'block';

        await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(error.error);
                }
                return response.json();
            })
            .then((data) => {
                alert(`Account created! A verification email has been sent to ${email}. Please check your inbox.`);
                createAccount.style.display = "none";
            })
            .catch((error) => {
                console.error('Error during signup:', error);
                alert(`Error during signup: ${error.message}`);
            });
        accountLoading.style.display = 'none';
    });

    logoutButton.addEventListener("click", function () {
        signOut(auth).then(() => {
            console.log('User signed out');
            loginSidebar.classList.remove("active");
            updateUI(null);
            setAlert('Signed out!', 'success', 5000);
        }).catch((error) => {
            console.error('Error signing out:', error);
            setAlert('Failed to sign out!', 'error', 5000);
        });
    });

    accountButton.addEventListener("click", function () {
        console.log('Account button clicked');
    });

    signupButton.addEventListener("click", function () {
        createAccount.style.display = "flex";
    });

    closeModal.addEventListener("click", function () {
        createAccount.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === createAccount) {
            createAccount.style.display = "none";
        }
    });

    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            createAccount.style.display = "none";
        }
    });
});

