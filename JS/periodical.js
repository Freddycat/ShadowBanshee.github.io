import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { getFirestore, doc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const freeTier = document.getElementById("free-tier");
    const snailMail = document.getElementById("snail-mail");
    const registerButton = document.getElementById("register-button");

    const checkoutModal = document.getElementById("checkout");
    const closeCheckout = document.getElementById("close-checkout");
    const confirmButton = document.getElementById("confirm-button");

    const loadingIndicator = document.getElementById('loading-indicator');
    const resultDisplay = document.getElementById('payment-result');
    const amountInput = document.getElementById('amount');

    const subscriptionDescription = document.getElementById('subscription-description');
    const input = document.getElementById('input-area');
    const checkoutDescription = document.getElementById('checkout-description');
    const checkoutAmount = document.getElementById('checkout-amount');
    const payment = document.getElementById('payment');

    const weeklyButton = document.getElementById('weekly-ish');

    const alertDiv = document.getElementById('mouse-alert');

    let stripe, elements, paymentElement, clientSecret, addressElement;
    let addressData = null;
    let nameData = null;
    let customerId = null;
    let subscriptionId = null;
    let submitted = false;
    let isSubscribed = false;
    let isSnailMail = false;
    let selectedSubscription = null;
    let amount = 0;

    // Function to check if the user is logged in
    function isLoggedIn() {
        return !!auth.currentUser;
    }

    const user = auth.currentUser;
    fetchSubscriptionStatus();
    toggleSubscriptionArea();

    async function waitForUser() {
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    resolve(user);
                    unsubscribe(); // Stop listening once the user is available
                }
            });
        });
    }

    async function fetchSubscriptionStatus() {
        return new Promise(async (resolve) => {
            const user = await waitForUser();
            if (!user) {
                showLoginDialog();
                resolve(false);
                return;
            }
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                isSubscribed = userData.subscribed || false;
                isSnailMail = userData.subscriptionType === 'snail-mail';
                setAlert('userData:', isSubscribed, isSnailMail);
                console.log('userData:', isSubscribed, isSnailMail);
                toggleSubscriptionArea();
                resolve(userData.subscribed || false);
            } else {
                console.log('No such document!');
                resolve(false);
            }
        });
    }

    // Toggle subscription area or login prompt based on login status
    function toggleSubscriptionArea() {
        const subscriptionForm = document.getElementById('subscription-form');
        const loginPrompt = document.getElementById('login-prompt');
        const subscriptionMessage = document.getElementById('subscription-message');

        if (isLoggedIn()) {
            if (isSubscribed) {
                if (isSnailMail) { //Subbed and snail mail
                    subscriptionForm.style.display = 'none';
                    subscriptionMessage.innerText = 'You are subscribed to the Snail Mail tier!\nEdit Subscription in your account settings.';
                    subscriptionMessage.style.display = 'block';
                    loginPrompt.style.display = 'none';
                    weeklyButton.disabled = false;
                } else { //Subbed and free
                    subscriptionForm.style.display = 'block';
                    subscriptionMessage.innerText = `You are subscribed to the free subscription tier!\nYou can edit in account, or upgrade to Snail-Mail!`;
                    subscriptionMessage.style.display = 'block';
                    loginPrompt.style.display = 'none';
                    weeklyButton.disabled = false;
                }
            } else { // User is logged in but not subscribed
                subscriptionMessage.innerText = `You are currently not subscribed\nto the Shadow Banshee Periodical! Pick a teir. :) `;
                subscriptionForm.style.display = 'block';
                subscriptionMessage.style.display = 'block';
                loginPrompt.style.display = 'none';
                weeklyButton.disabled = true;
                weeklyButton.title = "Subscribe to read for free!"; // Simple tooltip

            }
        } else { // User is not logged in
            subscriptionMessage.innerText = `You are not logged in!\nLog in to subscribe to the Shadow Banshee Periodical!`;
            subscriptionForm.style.display = 'none';
            subscriptionMessage.style.display = 'block';
            loginPrompt.style.display = 'block';
            weeklyButton.disabled = true;
            weeklyButton.title = "Subscribe to read for free!"; // Simple tooltip
        }
    }

    weeklyButton.addEventListener('mouseover', (event) => {
        if (!isSubscribed) {
            showMouseAlert("Subscribe to read for free!", event);
            weeklyButton.style.cursor = 'not-allowed';
        } else {
            hideMouseAlert();
            weeklyButton.style.cursor = 'pointer';
        }
    });
    weeklyButton.addEventListener('mousemove', (event) => {  // Hover message
        if (!isSubscribed) {
            showMouseAlert("Subscribe to read for free!", event);
            weeklyButton.style.cursor = 'not-allowed';
        }
    });
    weeklyButton.addEventListener('mouseout', (event) => {  // Hover message
        hideMouseAlert(event);
        weeklyButton.style.cursor = 'pointer';
    });

    auth.onAuthStateChanged(toggleSubscriptionArea);

    // Set default subscription to Snail Mail
    amountInput.value = 0;
    input.style.display = 'none';
    subscriptionDescription.innerText = "Snail Mail tier selected!\nPlease input at least $3 for snail mail. :)";
    freeTier.classList.remove('border');
    snailMail.classList.remove('border');

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

        amount = parseFloat(amountInput.value) * 100; // Convert to cents
        console.log('Amount updated:', amount);
    });

    amountInput.addEventListener("input", function () {
        amountCheck(); // Call the amountCheck function whenever the input value changes
    });

    async function amountCheck() {
        const amount = parseFloat(amountInput.value);
    }

    const selector1 = document.getElementById('selector1');
    const selector2 = document.getElementById('selector2');

    selector1.style.display = 'none';
    selector2.style.display = 'none';

    // Set amount based on subscription type
    freeTier.addEventListener("click", function () {
        freeTier.src = "Images/Periodical/subscriptionbuttons/cybertier2.png";
        snailMail.src = "Images/Periodical/subscriptionbuttons/interdimensionaldelivery1.png";
        selector2.style.display = 'none';
        selector1.style.display = 'inline-block';
        input.style.display = 'block';
        freeTier.classList.add('border');
        snailMail.classList.remove('border')
        amountInput.value = 0;
        document.getElementById("subscription-description").innerText =
            "Free subscription tier!\nFree or choose an amount!\n";
        selectedSubscription = 'free';
        amount = 0;
        amountCheck();
    });
    snailMail.addEventListener("click", function () {
        freeTier.src = "Images/Periodical/subscriptionbuttons/cybertier1.png";
        snailMail.src = "Images/Periodical/subscriptionbuttons/interdimensionaldelivery2.png";
        selector1.style.display = 'none';
        selector2.style.display = 'inline-block';
        input.style.display = 'block';
        snailMail.classList.add('border');
        freeTier.classList.remove('border')
        amountInput.value = 3;
        subscriptionDescription.innerText = "Snail Mail tier selected!\nPlease input at least $3 for snail mail. :)";
        selectedSubscription = 'snail-mail';
        amount = 300;
        amountCheck();
    });

    // Show the modal when the register button is clicked
    registerButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const user = await waitForUser();
        if (!user) {
            showLoginDialog();
            return;
        }

        if (selectedSubscription === 'snail-mail' && amountInput.value < 3) {
            setAlert('The minimum amount for Snail Mail subscription is $3.');
            return;
        }

        checkoutDescription.innerText = subscriptionDescription.innerText;
        checkoutAmount.innerText = `$${amountInput.value}`;
        checkoutModal.classList.add("active");

        if (selectedSubscription === 'free') {
            payment.style.display = 'none';
            document.getElementById('snail-description').classList.remove('active')
            document.getElementById('free-description').classList.add('active')
        }

        if (selectedSubscription === 'snail-mail') {
            payment.style.display = 'block';
            document.getElementById('free-description').classList.remove('active')
            document.getElementById('snail-description').classList.add('active')
        }

        if (amount !== 0) {
            loadingIndicator.style.display = 'block';
            const subscriptionResult = await createAndSubscribe();
            if (!subscriptionResult.success) {
                setAlert('Failed to create subscription: ' + subscriptionResult.error);
                return;
            }
            const clientSecret = subscriptionResult.clientSecret;

            stripe = Stripe(await fetchStripePublicKey());
            elements = stripe.elements({ clientSecret });
            if (selectedSubscription === 'snail-mail') {
                addressElement = elements.create('address', { mode: 'shipping' });
                addressElement.mount('#address-element');
            }
            paymentElement = elements.create('payment');
            paymentElement.mount('#payment-element');
            loadingIndicator.style.display = 'none';
        }
    });

    closeCheckout.addEventListener("click", function () {
        checkoutModal.classList.remove("active");
        if (paymentElement) {
            addressElement.unmount();
            paymentElement.unmount();

        } else {
            console.error("closeCheckout or checkoutModal element not found!");
        }
    });

    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            checkoutModal.classList.remove("active");
        }
        if (paymentElement) {
            addressElement.unmount();
            paymentElement.unmount();
        }
    });

    // Handle the confirm button click
    confirmButton.addEventListener("click", async function (event) {
        event.preventDefault();
        if (submitted) return; // Prevent double submission
        submitted = true;
        if (!isLoggedIn()) {
            showLoginDialog();
            return;
        }
        const subscriptionType = selectedSubscription;
        // Handle free subscription
        if (amount === 0) {
            const user = await waitForUser();
            const userDocRef = doc(db, 'users', user.uid);
            updateDoc(userDocRef, {
                subscribed: true,
                subscriptionType: 'free',
                donationAmount: 0,
            })
                .then(() => {
                    sendSubscribeEmail(user.email, subscriptionType);
                    setAlert('Thanks for subscribing!');
                    checkoutModal.classList.remove("active");
                    isSubscribed = true;
                    isSnailMail = false;
                    toggleSubscriptionArea();
                })
                .catch((error) => {
                    console.error('Error updating subscription:', error);
                    setAlert('Error updating subscription.');
                });

            return;
        }
        // Handle paid subscription
        else if (amount > 0) {
            try {
                payment.style.display = 'none';
                resultDisplay.innerText = '';
                loadingIndicator.style.display = 'block';
                // Confirm the payment method setup
                const { error } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                    },
                    redirect: 'if_required',
                });
                if (error) {
                    const messageContainer = document.querySelector('#error-message');
                    messageContainer.textContent = error.message;
                } else {
                    const messageContainer = document.querySelector('#payment-result');

                    messageContainer.textContent = 'Processing payment... Please wait.';

                    const { complete, value } = await addressElement.getValue();
                    if (complete) {
                        console.log('Customer ID:', customerId);
                        console.log('Complete address from getValue:', value);
                        addressData = value.address;
                        nameData = value.name;
                    }

                    // Update Firestore with subscription details
                    const user = await waitForUser();
                    const userDocRef = doc(db, 'users', user.uid);
                    await updateDoc(userDocRef, {
                        subscribed: true,
                        subscriptionType: 'snail-mail',
                        subscriptionId: subscriptionId,
                        customerId: customerId,
                        donationAmount: amount / 100,
                        address: addressData,
                        name: nameData,
                    });

                    // Update Stripe customer with address details
                    await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/update-customer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            customerId: customerId,
                            address: addressData,
                            name: nameData,
                        }),
                    });

                    sendSubscribeEmail(user.email, subscriptionType);
                    messageContainer.textContent = 'Payment successful! Thanks for subscribing!';
                    setAlert('Thanks for subscribing!');
                    checkoutModal.classList.remove("active");
                    isSubscribed = true;
                    isSnailMail = true;
                    toggleSubscriptionArea();
                }

            } catch (error) {
                console.error('Error during subscription process:', error);
                resultDisplay.innerText = 'Error initializing payment: ' + error.message;
            }
        }
    });

    // Create a new customer
    //_______________________________________________________________________________________

    async function createAndSubscribe() {
        try {
            const customerData = await createCustomer();
            if (customerData.success) {
                customerId = customerData.customer.id;
                console.log('Customer created:', customerId);

                const subscriptionData = await createSubscription();
                if (subscriptionData.success) {
                    subscriptionId = subscriptionData.subscriptionId;
                    clientSecret = subscriptionData.clientSecret;
                    console.log('Subscription created:', subscriptionId, clientSecret);
                    return { success: true, subscriptionId, clientSecret };
                } else {
                    console.error('Failed to create subscription:', subscriptionData.error);
                    return { success: false, error: subscriptionData.error };
                }
            } else {
                console.error('Failed to create customer:', customerData.error);
                return { success: false, error: customerData.error };
            }
        } catch (error) {
            console.error('Error during subscription process:', error);
            return { success: false, error: customerData.error };
        }
    }

    async function createCustomer() {

        const user = await waitForUser();
        if (!user) {
            showLoginDialog();
            return;
        }

        //console.log('Completed address data:', addressData);
        console.log('Name data:', nameData);
        try {
            const customerResponse = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/create-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    name: nameData,
                    //    address: addressData,
                }),
            });
            if (!customerResponse.ok) {
                throw new Error(`Failed to create customer: ${customerResponse.statusText}`);
            }
            const customerData = await customerResponse.json();

            if (customerData.success && customerData.customer) {
                return { success: true, customer: customerData.customer };
            } else {
                return { success: false, error: 'Invalid customer data returned' };
            }


        } catch (error) {
            console.error('Error during customer creation:', error);
            // Handle the error appropriately, maybe show a message to the user
            return { success: false, error: error.message };
        }
    }

    async function createSubscription() {
        console.log('Customer data:', customerId);
        console.log('amount:', amount);
        try {
            const subscriptionResponse = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unit_amount: amount,
                    customer: customerId,
                }),
            });
            if (!subscriptionResponse.ok) {
                throw new Error(`Failed to create sub: ${subscriptionResponse.statusText}`);
            }
            const subscriptionData = await subscriptionResponse.json();


            if (subscriptionData.success && subscriptionData.subscriptionId) {
                return {
                    success: true,
                    subscriptionId: subscriptionData.subscriptionId,
                    clientSecret: subscriptionData.clientSecret
                };
            } else {
                return { success: false, error: 'Invalid subscription data returned' };
            }

        } catch (error) {
            console.error('Error during customer creation:', error);
            // Handle the error appropriately, maybe show a message to the user
        }
    }

    function sendSubscribeEmail(email, subscriptionType) {
        fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/sendSubscribeEmail', {
            //fetch('http://127.0.0.1:5001/shadowbanshee-79c70/us-central1/api/sendSubscribeEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, subscriptionType }),
        });
    }

    // Fetch the Stripe public key

    async function fetchStripePublicKey() {
        const response = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/stripe-public-key');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.publicKey;
    }


    // BOOK SECTION  BOOK SECTION  BOOK SECTION  BOOK SECTION  BOOK SECTION  BOOK SECTION  BOOK SECTION 

    const TSBP1 = document.querySelectorAll('.card-left');
    const TSBP2 = document.querySelectorAll('.card-right');
    const book = document.getElementById('book-modal');
    const content = document.getElementById('page-content');
    const close = document.getElementById('close-book');

    const book1 = [
        '/Images/TSBP1/page1.png',
        '/Images/TSBP1/page2.png',
        '/Images/TSBP1/page3.png',
        '/Images/TSBP1/page4.png',
        '/Images/TSBP1/page5.png',
        '/Images/TSBP1/page6.png',
        '/Images/TSBP1/page7.png'
    ];

    const book2 = [
        '/Images/TSBP2/page1.png',
        '/Images/TSBP2/page2.png',
        '/Images/TSBP2/page3.png',
        '/Images/TSBP2/page4.png',
        '/Images/TSBP2/page5.png',
        '/Images/TSBP2/page6.png',
        '/Images/TSBP2/page7.png'
    ];


    let currentPage = 1;
    let isZoomed = false;

    fetchSubscriptionStatus();

    TSBP1.forEach(a => {
        a.addEventListener('click', () => {
            console.log('open book 1');
            openBook(book1);
        });
    });

    TSBP2.forEach(b => {
        console.log("Element found:", b);
        b.addEventListener('click', () => {
            if (isSubscribed) { // Check subscription status before opening book 2
                console.log('open book 2');
                openBook(book2);
            }
        });

        b.addEventListener('mouseover', (event) => {  // Hover message
            if (!isSubscribed) {
                if (!alertDiv) {
                    console.error("alertDiv element not found!"); // Check for null!
                }
                showMouseAlert("Subscribe to read for free!\nOr read the first one. :)", event);
                b.style.cursor = 'not-allowed';

            } else {
                hideMouseAlert();
                b.style.cursor = 'pointer';
            }
        });

        b.addEventListener('mousemove', (event) => {
            if (!isSubscribed) {
                showMouseAlert("Subscribe to read for free!\nOr read the first one. :)", event);
            }
        });

        b.addEventListener('mouseout', (event) => {

            hideMouseAlert();
            b.style.cursor = 'pointer';

        })

    });

    close.addEventListener('click', function () {
        closeBook();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            closeBook();
        }
    });

    function openBook(images) {
        book.style.display = 'flex';
        displayBook(images);
        showPage(1);
    }
    function closeBook() {
        book.style.display = 'none';
        currentPage = 1;
        isZoomed = false;
    }


    function showMouseAlert(message, event) {
        alertDiv.innerText = message;
        alertDiv.style.left = event.pageX + 'px';
        alertDiv.style.top = event.pageY + 'px';
        alertDiv.style.display = 'block';
        console.log('listening');
    }

    function hideMouseAlert() {
        const alertDiv = document.getElementById('mouse-alert');
        alertDiv.style.display = 'none';
    }


    async function displayBook(images) {

        const promises = images.map((src, index) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onerror = (error) => reject(error);
                img.src = src;
                img.onload = () => {
                    resolve(img);
                };
            });
        });

        try {
            const loadedImages = await Promise.all(promises);

            content.innerHTML = '';
            // Append loaded images to the DOM
            loadedImages.forEach((img, index) => {
                img.dataset.page = index + 1;
                img.classList.add('book-page')
                img.addEventListener('click', zoomClick)
                content.appendChild(img);
            });

            showPage(currentPage)

        } catch (error) {
            console.error("Error loading images:", error);
            // Handle image loading errors (e.g., display an error message)
        }
    }

    function showPage(pageNumber) {

        const pages = document.querySelectorAll('.book-page');
        const totalPages = pages.length;

        // Hide all pages initially
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show the specified page
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            pages[pageNumber - 1].classList.add('active');
        }
        resizeText();
    }

    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');

    prev.addEventListener('click', function () {
        navigate(-1);
    });

    next.addEventListener('click', function () {
        navigate(+1);
    });

    function navigate(step) {
        currentPage += step;
        if (currentPage < 1) currentPage = 1;
        if (currentPage > 7) currentPage = 7;
        showPage(currentPage);
    }

    function zoomClick(event) {
        const img = event.target;
        const container = img.parentElement;

        // Get the click position relative to the image
        const rect = img.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;  // X coordinate clicked relative to the image
        const offsetY = event.clientY - rect.top;   // Y coordinate clicked relative to the image
        const percentageX = offsetX / rect.width;   // Percentage of image width clicked
        const percentageY = offsetY / rect.height;  // Percentage of image height clicked

        // Toggle zoom
        if (isZoomed) {
            img.style.transform = '';  // Reset zoom
            img.classList.remove('zoomed');
            isZoomed = false;
        } else {
            img.style.transformOrigin = `${percentageX * 100}% ${percentageY * 100}%`;  // Zoom to clicked position
            img.style.transform = 'scale(2)';  // Zoom in to 2x
            img.classList.add('zoomed');
            isZoomed = true;
        }
    }
    function resizeText() {
        const supportElement = document.querySelector('.Support');
        const textElement = document.querySelectorAll('.text, .text2');

        // Ensure the container width is available
        if (!supportElement) return;

        // Get the width of the container
        let supportWidth = supportElement.offsetWidth;

        // Calculate font size based on container width
        let fontSize = supportWidth * 0.038; // Adjust the multiplier as needed

        // Apply the font size to all text elements
        textElement.forEach(el => {
            el.style.fontSize = `${fontSize}px`;
        });
    }
    // Initialize with the specified page or the first page
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = parseInt(urlParams.get('page'), 7);
    currentPage = pageParam && pageParam >= 1 && pageParam <= 7 ? pageParam : 1;
    showPage(currentPage);

    window.addEventListener('resize', resizeText);

});
