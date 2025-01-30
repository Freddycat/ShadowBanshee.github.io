document.addEventListener('DOMContentLoaded', function () {
    function handleButtonHover(button, isHover, originalSrc, newSrc) {
        button.querySelector('.buttonJS').src = isHover ? newSrc : originalSrc;
    }

    function addHoverListeners(element, original, hover) {
        element.addEventListener('mouseover', () => handleButtonHover(element, true, original, hover));
        element.addEventListener('mouseout', () => handleButtonHover(element, false, original, hover));
    }

    const buttonElement2 = document.querySelector('.periodical');
    addHoverListeners(buttonElement2, '/Images/periodical_logo_2.png', '/Images/periodical_logo.png');
});

document.addEventListener('DOMContentLoaded', function () {
    function handleButtonHover(button, isHover, originalSrc, newSrc) {
        const img = button.querySelector('.buttonJS');
        img.src = isHover ? newSrc : originalSrc;
    }

    const buttons = [
        { element: document.querySelector('.banshee_JS'), original: '/Images/ZineButtons/bansheebutton1.png', hover: '/Images/ZineButtons/bansheebutton2.png' },
        { element: document.querySelector('.dream_JS'), original: '/Images/ZineButtons/dreambutton1.png', hover: '/Images/ZineButtons/dreambutton2.png' },
        { element: document.querySelector('.super_JS'), original: '/Images/ZineButtons/superkidbutton2.png', hover: '/Images/ZineButtons/superkidbuttonopen2.png' },
        { element: document.querySelector('.Img1'), original: '/Images/Banshee_POT.png', hover: '/Images/Banshee_POTG.png' },
    ];

    buttons.forEach(button => {
        button.element.addEventListener('mouseover', () => handleButtonHover(button.element, true, button.original, button.hover));
        button.element.addEventListener('mouseout', () => handleButtonHover(button.element, false, button.original, button.hover));
    });
});
