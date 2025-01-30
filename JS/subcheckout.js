document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('payment-form');
    const resultDisplay = document.getElementById('payment-result');
    const loadingIndicator = document.getElementById('loading-indicator');
    const checkoutButton = document.getElementById("checkout-button");
    const payButton = document.getElementById("submit"); // Assuming you have a button with this ID
    let submitted = false;
    let elements;
    let addressElement, paymentElement;
    let clientSecret; // Store client secret here

    // Initialize Stripe
    const publicKey = await fetchStripePublicKey();
    const stripe = Stripe(publicKey);

    checkoutButton.addEventListener("click", async () => {
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const amount = totalPrice * 100; // Stripe expects the amount in cents

        console.log('Amount being sent:', amount); // Log the amount for debugging

        if (totalPrice > 0) {
            loadingIndicator.style.display = 'block';
            try {
                resultDisplay.innerText = '';
                // Fetch the client secret with the calculated amount
                clientSecret = await fetchClientSecret(amount); // Store the client secret

                // Set up Elements with the client secret
                const options = { mode: 'shipping' };
                elements = stripe.elements({ clientSecret }); // Initialize Elements with the clientSecret

                addressElement = elements.create('address', options);
                paymentElement = elements.create('payment');
                addressElement.mount('#address-element');
                paymentElement.mount('#payment-element');

            } catch (error) {
                resultDisplay.innerText = 'Error fetching client secret: ' + error.message;
            } finally {
                loadingIndicator.style.display = 'none'; // Hide the loading indicator
            }

        } else {
            resultDisplay.innerText = 'Your cart is empty. Please add items to checkout.';
        }
    });

    payButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission

        if (submitted) return; // Prevent double submission
        submitted = true;
        form.querySelector('button').disabled = true; // Disable button to prevent multiple clicks

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                },
                redirect: 'if_required',
            });

            if (error) {
                resultDisplay.innerText = error.message; // Display error message
            } else {
                resultDisplay.innerText = 'Payment successful!'; // Success message
                displayPaymentSuccess();
            }
        } catch (error) {
            resultDisplay.innerText = 'An error occurred. Please try again.';
            console.error('Payment error:', error);
        } finally {
            form.querySelector('button').disabled = false; // Re-enable the button
            submitted = false; // Reset the submission state
        }
    });

    async function fetchStripePublicKey() {
        const response = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/stripe-public-key');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.publicKey; // Ensure you're returning the public key
    }

    async function fetchClientSecret(amount) {
        const response = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/createPaymentIntent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency: 'usd', paymentMethodType: 'card' })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Failed to retrieve client secret: ' + errorText);
        }

        const { clientSecret } = await response.json();
        if (!clientSecret) throw new Error('Failed to retrieve client secret');
        return clientSecret;
    }

    function displayPaymentSuccess() {
        // Hide the checkout form elements
        const checkoutForm = document.getElementById('payment-form');
        checkoutForm.style.display = 'none'; // Hides the payment form

        const checkoutItems = document.getElementById('checkout-items');
        checkoutItems.style.display = 'none'; // Hides the checkout items

        // Show the ultimatum result element and update its message
        const ultimatumResult = document.getElementById('ultimatum-result');
        ultimatumResult.style.display = 'flex'; // Ensure it's visible

        cart = []; // Clear cart array
        totalPrice = 0; // Reset total price

        localStorage.setItem('cart', JSON.stringify(cart));

        updateCart();
    }
});
