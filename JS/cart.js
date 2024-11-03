let cart = []; // Array to store cart items
let totalPrice = 0;

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById("cart-sidebar");
    cartSidebar.classList.toggle("active");
}

// Update cart item count in the cart icon
function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById("count");

    if (cartCount > 0) {
        cartCountElement.innerText = cartCount;
        cartCountElement.style.display = "block";
    } else {
        cartCountElement.style.display = "none";
    }
}

// Add item to cart
function addToCart(itemName) {
    const itemElement = Array.from(document.querySelectorAll(".item")).find(item =>
        item.querySelector("h3").innerText === itemName
    );

    if (!itemElement) return;

    const price = parseFloat(itemElement.getAttribute("data-price"));
    const itemImage = itemElement.querySelector(".ico");
    const imageSrc = itemImage ? itemImage.src : null;

    const existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: itemName, price: price, quantity: 1, image: imageSrc });
    }
    totalPrice += price;

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    updateCartCount();
}

// Update cart display in sidebar
function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.innerText = "Your cart is empty.";
        cartItemsContainer.appendChild(emptyMessage);
    } else {

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
            <div class="cart-item-content">
                <div class="cart-item-desc">
                    <img src="${item.image}" class="cart-item-image" />
                    <span class="cart-item-name">${item.name}</span>
                </div>
                <div class="cart-item-info">
                    <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
                    <span class="cart-item-price">Price: $${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button onclick="removeFromCart('${item.name}')">Remove</button>
            </div>
        `;
            cartItemsContainer.appendChild(cartItem);
        });

        const totalDisplay = document.createElement("div");
        totalDisplay.classList.add("total-price");
        totalDisplay.innerHTML = `<strong>Total: $${totalPrice.toFixed(2)}</strong>`;
        cartItemsContainer.appendChild(totalDisplay);
    }
}

// Remove item from cart
function removeFromCart(itemName) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        totalPrice -= item.price * item.quantity;
        cart.splice(itemIndex, 1);
        updateCart();
        updateCartCount();
    }
}

// Checkout functionality
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("checkout-button").addEventListener("click", checkout);
    document.getElementById("close").addEventListener("click", checkout);

    function checkout() {
        const checkoutDiv = document.getElementById("checkout");
        checkoutDiv.classList.toggle("active");

        loadCartFromStorage(); // Load the cart from local storage
        updateCheckoutCart();  // Update the cart display
    }

    // Load cart from local storage with validation
    function loadCartFromStorage() {
        try {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                cart = JSON.parse(storedCart);
                if (!Array.isArray(cart)) {
                    cart = []; // Reset if not an array
                }
            }
            totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
            console.log("Loaded cart:", cart);
            console.log("Total price:", totalPrice);
            updateCart(); // Ensure cart is displayed
            updateCartCount(); // Update the count display
        } catch (error) {
            console.error("Error parsing cart from localStorage:", error);
            cart = []; // If parsing fails, reset to an empty array
        }
    }

    // Update checkout cart display
    function updateCheckoutCart() {
        const cartItemsContainer = document.getElementById("checkout-items");
        cartItemsContainer.innerHTML = "";

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <div class="cart-item-content">
                    <div class="cart-item-desc">
                        <img src="${item.image}" class="cart-item-image" />
                        <span class="cart-item-name">${item.name}</span>
                    </div>
                    <div class="cart-item-info">
                        <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
                        <span class="cart-item-price">Price: $${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        const totalDisplay = document.createElement("div");
        totalDisplay.classList.add("total-price");
        totalDisplay.innerHTML = `<strong>Total: $${totalPrice.toFixed(2)}</strong>`;
        cartItemsContainer.appendChild(totalDisplay);
    }

});
