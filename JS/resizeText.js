window.addEventListener('resize', resizeText);

function resizeText() {
    const supportElement = document.querySelector('.Support');
    const textElement = document.querySelectorAll('.text, .text2');

    // Get the width of the container
    let supportWidth = supportElement.offsetWidth;

    // Calculate font size based on container width
    let fontSize = supportWidth * 0.05; // Adjust the multiplier as needed

    // Apply the font size to all text elements
    textElement.forEach(el => {
        el.style.fontSize = `${fontSize}px`;
    });
}

resizeText();