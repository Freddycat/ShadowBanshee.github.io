import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userData = null;
let userDocRef = null;
let currentUser = null;

document.addEventListener("DOMContentLoaded", function () {
    const accountUsername = document.getElementById("account-username");
    const accountEmail = document.getElementById("account-email");
    const logoutButton = document.getElementById("logout-button");
    const deleteAccountButton = document.getElementById("delete-account-button");
    const subscriptionList = document.getElementById("subscription-list");
    const editSubscriptionContainer = document.getElementById("edit-subscription-container");
    const subscriptionTypeSelect = document.getElementById("selection-type");
    const amountInput = document.getElementById("selection-amount");
    const saveSubscriptionButton = document.getElementById("save-subscription-button");

    subscriptionTypeSelect.value = 'free';

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            userDocRef = doc(db, 'users', user.uid);
            loadUserData();
        } else {
            window.location.href = 'index.html'
        }
    });

    async function loadUserData() {
        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                userData = docSnap.data();
                displayUserData();
            } else {
                console.log('No user!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const unsubscribedDiv = document.getElementById('unsubscribed');
    const freeDiv = document.getElementById('subscribed-free');
    const paidDiv = document.getElementById('subscribed-paid');
    const canceledDiv = document.getElementById('canceled');

    function displayUserData() {

        editSubscriptionContainer.style.display = 'none';
        unsubscribedDiv.style.display = 'none';
        freeDiv.style.display = 'none';
        paidDiv.style.display = 'none';
        canceledDiv.style.display = 'none';

        accountUsername.textContent = userData.username;
        accountEmail.textContent = userData.email;

        if (userData) {

            console.log(userData);

            if (userData.canceled === true) {displaycanceled();
                if (userData.subscriptionType === 'free') {displayFreeSub();}
                return;
            }
            else if (userData.subscriptionType === 'free') {displayFreeSub();}
            else if (userData.subscriptionType == 'snail-mail') {displayPaidSub();}
            else if (userData.subscribed === false) {displayUnsubbed();}
            else if (userData.canceled === true) {displaycanceled();}
            if (userData.subscribed) {
                disableDeleteAccount();
            }
        }
    }

    function displayUnsubbed() {
        unsubscribedDiv.style.display = 'block';
        console.log('Displaying:', userData.subscribed)
    }

    function displayFreeSub() {
        freeDiv.style.display = 'block';
    }

    const subType = document.getElementById('subscription-type');
    const subAmount = document.getElementById('subscription-amount');
    function displayPaidSub() {
        paidDiv.style.display = 'block';
        subType.innerText = `${userData.subscriptionType}`
        subAmount.innerText = `${userData.donationAmount.toFixed(2)}`
    }

    const dateDiv = document.getElementById('cancel-date')
    function displaycanceled() {
        canceledDiv.style.display = 'block';
        dateDiv.innerText = `${new Date(userData.currentPeriodEnd * 1000).toLocaleDateString()}`;
    }

    function disableDeleteAccount() {
        deleteAccountButton.disabled = true;
        deleteAccountButton.style.backgroundColor = 'grey';
        deleteAccountButton.title = 'You must wait until your subscription runs out to delete your account.';
    }


    const editButton = document.getElementById("edit-button");
    editButton.addEventListener("click", editSub);
    function editSub() {
        editSubscriptionContainer.style.display = 'block';
        editSubscriptionContainer.scrollIntoView({ behavior: 'smooth' });
        saveSubscriptionButton.addEventListener("click", async function () {
            const selectedType = subscriptionTypeSelect.value;
            const price = parseFloat(amountInput.value);
            if (selectedType === 'snail-mail' && amount < 3) {
                alert('Snail Mail subscription requires a minimum of $3.');
                return;
            }
            if (amount === 0) {
                const password = prompt("This cancels your paid subscription! (you can reactivate it at any time)\nPlease enter your password to confirm:");
                const credential = EmailAuthProvider.credential(userData.email, password);
                try {
                    await reauthenticateWithCredential(currentUser, credential);
                    cancelStripeSubscription();
                    updateDoc(userDocRef, {
                        subscriptionType: 'free',
                    });
                    return;
                } catch (error) {
                    console.error('Cancellation failed:', error);
                    alert('Reauthentication failed. Please check your credentials.');
                    return;
                }
            }
            try {
                const response = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/update-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subscriptionId: userData.subscriptionId,
                        unit_amount: price * 100,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    alert('Your subscription has been updated.');

                    try {
                        await updateDoc(userDocRef, {
                            subscriptionType: selectedType,
                            donationAmount: price,
                        });
                        loadUserData();
                    } catch (error) {
                        console.error('Error updating Firestore:', error);
                        alert('Error updating Firestore.');
                    }
                } else {
                    alert('Error updating subscription: ' + data.error);
                }
            } catch (error) {
                console.error('Error updating subscription:', error);
                alert('Error updating subscription.');
            }
        })
    }

    const unsubButtons = document.getElementsByClassName("unsubscribe-button");

    for (const unsubButton of unsubButtons) {
        unsubButton.addEventListener("click", unsub);
    }

    async function unsub() {
        if (userData.donationAmount === 0) {
            updateDoc(userDocRef, {
                subscribed: false,
                subscriptionType: ''
            })
                .then(() => {
                    sendUnsubscribeEmail(userData.email, userData.subscriptionType);
                    alert('You have been unsubscribed from the Free Newsletter!');
                    loadUserData();
                    return;
                })
                .catch((error) => {
                    console.error('Error updating subscription:', error);
                    alert('Error updating subscription.');
                    return;
                });
        } else {
            const password = prompt("Are you sure you want to cancel your subscription? (you can reactivate it at any time)\nPlease enter your password to confirm:");
            const credential = EmailAuthProvider.credential(userData.email, password);
            try {
                await reauthenticateWithCredential(currentUser, credential);
                cancelStripeSubscription();
                updateDoc(userDocRef, {
                    subscribed: false,
                    subscriptionType: ''
                })
                return;
            } catch (error) {
                console.error('Cancellation failed:', error);
                alert('Reauthentication failed. Please check your credentials.');
                return;
            }
        }
    }

    document.getElementById("reactivate-button").addEventListener("click", async function () {
        reactivateSubscription();
    });

    async function cancelStripeSubscription() {
        try {
            const response = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: userData.subscriptionId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                sendUnsubscribeEmail(userData.email, userData.subscriptionType);
                alert('You have been unsubscribed! Your subscription will end at the end of the billing period.');
                try {
                    await updateDoc(userDocRef, {
                        canceled: true,
                        currentPeriodEnd: data.currentPeriodEnd, // Store the end date in Firestore
                    });
                    loadUserData();
                } catch (error) {
                    console.error('Error updating Firestore:', error);
                    alert('Error updating Firestore.');
                }
            } else {
                alert('Error canceling subscription: ' + data.error);
            }
        } catch (error) {
            console.error('Error canceling subscription:', error);
            alert('Error canceling subscription.');
        }
    }

    async function reactivateSubscription() {
        try {
            const response = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/reactivate-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: userData.subscriptionId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert('You have been resubscribed. Welcome back!');
                try {
                    await updateDoc(userDocRef, {
                        canceled: false,
                        subscribed: true,
                        subscriptionType: 'snail-mail',
                    });
                    loadUserData();
                } catch (error) {
                    console.error('Error updating Firestore:', error);
                    alert('Error updating Firestore.');
                }
            } else {
                alert('Error re-subscribing: ' + data.error);
            }
        } catch (error) {
            console.error('Error', error);
        }
    }

    let amount = 0;

    // Update the amount variable when the input changes
    amountInput.addEventListener('input', function () {

        const inputValue = amountInput.value;

        const filteredValue = inputValue.replace(/[^0-9]/g, '');
        if (filteredValue.length === 2 && filteredValue !== "10") {
            amountInput.value = filteredValue.substring(1); // Keep only the last digit
        } else if (filteredValue > 10) {
            amountInput.value = filteredValue.substring(1); // Keep only the last digit
        } else {
            amountInput.value = filteredValue;
        }

        amount = amountInput.value; // Convert to cents
        console.log('Amount updated:', amount * 100);
    });

    function sendUnsubscribeEmail(email, subscriptionType) {
        fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/sendUnsubscribeEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, subscriptionType }),
        });
    }

    logoutButton.addEventListener("click", function () {
        signOut(auth).then(() => {
            console.log('User signed out');
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    });

    deleteAccountButton.addEventListener("click", async function () {
        if (currentUser) {

            const email = userData.email;
            const password = prompt('Are you sure you want to delete your account? Please enter your password to confirm account deletion:');
            const credential = EmailAuthProvider.credential(email, password);

            try {
                await reauthenticateWithCredential(currentUser, credential);

                // Send a request to the backend to handle account deletion
                fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/delete-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ uid: userData.uid })
                }).then(response => {
                    if (response.ok) {
                        console.log('Account deletion process started.');
                        alert('Your account has been deleted! You will be redirected to home page.');
                        window.location.href = 'index.html'; // Redirect after process starts
                    } else {
                        console.error('Failed to start account deletion process.');
                    }
                }).catch(error => {
                    console.error('Error requesting account deletion:', error);
                });
            } catch (error) {
                console.error('Reauthentication failed:', error);
                alert('Reauthentication failed. Please check your credentials.');
                return;
            }
        }
    });
});