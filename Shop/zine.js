document.addEventListener('DOMContentLoaded', function () {
    function handleButtonHover(button, isHover, originalSrc, newSrc) {
        const img = button.querySelector('.buttonJS');
        img.src = isHover ? newSrc : originalSrc;
    }

    const buttons = [
        { element: document.querySelector('.home'), original: 'title/Oneeyedsuperkid.png', hover: 'title/Oneeyedsuperkidhover.png' },
        { element: document.querySelector('.banshee_JS'), original: 'Shop/ZineButtons/bansheebutton1.png', hover: 'Shop/ZineButtons/bansheebutton2.png' },
        { element: document.querySelector('.dream_JS'), original: 'Shop/ZineButtons/dreambutton1.png', hover: 'Shop/ZineButtons/dreambutton2.png' },
        { element: document.querySelector('.super_JS'), original: 'Shop/ZineButtons/superkidbutton1.png', hover: 'Shop/ZineButtons/superkidbuttonopen2.png' },
        { element: document.querySelector('.Img1'), original: 'BansheePage/Banshee_POT.png', hover: 'BansheePage/Banshee_POTG.png' },
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