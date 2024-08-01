document.addEventListener('DOMContentLoaded', function () {
    function handleButtonHover(button, isHover, originalSrc, newSrc) {
        const img = button.querySelector('.buttonJS');
        img.src = isHover ? newSrc : originalSrc;
    }

    const buttons = [
        { element: document.querySelector('.home'), original: 'Images/title/Oneeyedsuperkid.png', hover: 'Images/title/Oneeyedsuperkidhover.png' },
        { element: document.querySelector('.banshee_JS'), original: 'Images/ZineButtons/bansheebutton1.png', hover: 'Images/ZineButtons/bansheebutton2.png' },
        { element: document.querySelector('.dream_JS'), original: 'Images/ZineButtons/dreambutton1.png', hover: 'Images/ZineButtons/dreambutton2.png' },
        { element: document.querySelector('.super_JS'), original: 'Images/ZineButtons/superkidbutton2.png', hover: 'Images/ZineButtons/superkidbuttonopen2.png' },
        { element: document.querySelector('.Img1'), original: 'Images/Banshee_POT.png', hover: 'Images/Banshee_POTG.png' },
    ];

    buttons.forEach(button => {
        button.element.addEventListener('mouseover', () => handleButtonHover(button.element, true, button.original, button.hover));
        button.element.addEventListener('mouseout', () => handleButtonHover(button.element, false, button.original, button.hover));
    });
});

function scrollToSection(sectionClass) {
    const elements = document.getElementsByClassName(sectionClass);
    if (elements.length > 0) {
        elements[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
}

function bansheelink() {
    scrollToSection('BansheeSection');
}

function dreamlink() {
    scrollToSection('Dreamwalker');
}

function superkidlink() {
    scrollToSection('SuperKidSection');
}


function checkForHash() {
    const hash = window.location.hash.substring(1); // Remove the '#' character
    if (hash) {
        scrollToSection(hash);
    }
}

window.onload = checkForHash; // Ensure the scroll logic runs after the full page load