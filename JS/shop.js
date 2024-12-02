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

function scrollImages(button, direction) {
    const carousel = button.closest('.image-carousel');
    const container = carousel.querySelector('.image-container');
    const images = container.querySelectorAll('img');

    const gap = parseInt(getComputedStyle(container).gap) || 0;
    const imgWidth = images[0].offsetWidth + gap * 2; // Full width including gaps
    const carouselWidth = carousel.offsetWidth;

    // Find the current scroll position
    let currentIndex = parseInt(container.dataset.index) || 0;

    // Calculate the new offset
    currentIndex += direction;

    // Prevent scrolling out of bounds
    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex >= images.length) {
        currentIndex = images.length - 1;
    }

    // Calculate the offset to center the current image
    const offset = -(currentIndex * imgWidth) + (carouselWidth - imgWidth) / 2;

    // Apply the new offset
    container.style.transform = `translateX(${offset}px)`;
    container.dataset.index = currentIndex;
}

window.addEventListener('resize', () => {
    const carousels = document.querySelectorAll('.image-carousel');
    carousels.forEach((carousel) => {
        const container = carousel.querySelector('.image-container');
        const images = container.querySelectorAll('img');

        const gap = parseInt(getComputedStyle(images[0]).marginRight) || 0;
        const imgWidth = images[0].offsetWidth + gap * 2;
        const carouselWidth = carousel.offsetWidth;

        const currentIndex = parseInt(container.dataset.index) || 0;

        // Recalculate the offset to center the current image
        const offset = -(currentIndex * imgWidth) + (carouselWidth - imgWidth) / 2;
        container.style.transform = `translateX(${offset}px)`;
    });
});