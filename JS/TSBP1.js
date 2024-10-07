let currentPage = 1;
const totalPages = 7;

function showPage(pageNumber) {
    for (let i = 1; i <= totalPages; i++) {
        document.getElementById('page' + i).classList.remove('active');
    }
    document.getElementById('page' + pageNumber).classList.add('active');
    resizeText()
}

function navigate(step) {
    currentPage += step;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    showPage(currentPage);
}

// Initialize with the first page
showPage(currentPage);

let isZoomed = false;  // Track whether we are zoomed in

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

document.addEventListener('DOMContentLoaded', function () {
    resizeText();
});

window.addEventListener('load', function () {
    resizeText();
    // Any additional logic to ensure elements are correctly sized and displayed
});

window.addEventListener('resize', function () {
    resizeText();
});

window.addEventListener('resize', resizeText);

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

//smoothscroller for store links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});