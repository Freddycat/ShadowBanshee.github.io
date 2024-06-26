document.addEventListener('DOMContentLoaded', function () {
    function handleButtonHover(button, isHover, originalSrc, newSrc) {
        button.querySelector('.buttonJS').src = isHover ? newSrc : originalSrc;
    }

    function addHoverListeners(element, original, hover) {
        element.addEventListener('mouseover', () => handleButtonHover(element, true, original, hover));
        element.addEventListener('mouseout', () => handleButtonHover(element, false, original, hover));
    }

    const buttonElement = document.querySelector('.home');
    addHoverListeners(buttonElement, 'title/Oneeyedsuperkid.png', 'title/Oneeyedsuperkidhover.png');

    const buttonElement1 = document.querySelector('.zineImg');
    addHoverListeners(buttonElement1, 'Zinebutton/zines.png', 'Zinebutton/zines2.png');

    const buttonElement2 = document.querySelector('.periodical');
    addHoverListeners(buttonElement2, 'Questions/Images/periodical_logo_2.png', 'Questions/Images/periodical_logo.png');
});
