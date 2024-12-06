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
    const imgWidth = images[0].offsetWidth; // Image width only
    const carouselWidth = carousel.offsetWidth;

    // Get the current scroll index or initialize it
    let currentIndex = parseInt(container.dataset.index) || 0;

    // Update the scroll index
    currentIndex += direction;

    // Clamp the index to prevent out-of-bounds scrolling
    currentIndex = Math.max(0, Math.min(currentIndex, images.length - 1));

    // Adjust the offset
    let offset = -(currentIndex * (imgWidth + gap)) + (carouselWidth - imgWidth) / 2;

    // Special handling for the last image
    if (currentIndex === images.length - 1) {
        const totalWidth = images.length * (imgWidth + gap) - gap; // Total width of all images including gaps
        const maxOffset = -(totalWidth - carouselWidth); // Prevents overshooting
        offset = Math.max(maxOffset, offset); // Keeps the last image aligned with a ghost gap
    }

    // Prevent overshooting for the first image
    if (currentIndex === 0) {
        offset = 0;
    }

    // Apply the new offset
    container.style.transform = `translateX(${offset}px)`;
    container.dataset.index = currentIndex;
}


// Recalculate offsets on viewport resize
function adjustCarousel() {
    const carousels = document.querySelectorAll('.image-carousel');
    carousels.forEach((carousel) => {
        const container = carousel.querySelector('.image-container');
        const images = container.querySelectorAll('img');
        const gap = parseInt(getComputedStyle(container).gap) || 0;
        const imgWidth = images[0].offsetWidth + gap;
        const carouselWidth = carousel.offsetWidth;
        const currentIndex = parseInt(container.dataset.index) || 0;

        // Recalculate the offset to center the image
        const offset = -(currentIndex * imgWidth) + (carouselWidth - imgWidth) / 2;
        container.style.transform = `translateX(${offset}px)`;
    });
}

window.addEventListener('resize', adjustCarousel);