// Filter items based on category
function filterItems(category) {
    const items = document.querySelectorAll(".item");
    items.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = "flex"; // Show matching items
        } else {
            item.style.display = "none"; // Hide non-matching items
        }
    });
}

// Add click event to all <p> elements with class "X" to hide details
document.querySelectorAll("p.X").forEach(button => {
    button.addEventListener("click", event => {
        event.stopPropagation(); // Prevents event from bubbling up
        hideItemDetails();
    });
});

function hideItemDetails() {
    const allItems = document.querySelectorAll(".item");
    allItems.forEach(i => i.classList.remove("active"));
}

document.getElementById("pageContent").addEventListener("click", hideItemDetails);

// Show item details on click
function showItemDetails(item) {
    const allItems = document.querySelectorAll(".item");
    hideItemDetails(); // Hide other item details first
    item.classList.toggle("active"); // Toggle selected item
}
