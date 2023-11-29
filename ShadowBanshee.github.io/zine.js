document.addEventListener('DOMContentLoaded', function () {
    function handleButtonHover(button, isHover, originalSrc, newSrc) {
        const img = button.querySelector('.zinebutton');
        img.src = isHover ? newSrc : originalSrc;
    }

    const buttons = [
        { element: document.querySelector('.home'), original: 'title/Oneeyedsuperkid.png', hover: 'title/Oneeyedsuperkidhover.png' },
        { element: document.querySelector('.banshee'), original: 'ZineButtons/bansheebutton1.png', hover: 'ZineButtons/bansheebutton2.png' },
        { element: document.querySelector('.dream'), original: 'ZineButtons/dreambutton1.png', hover: 'ZineButtons/dreambutton2.png' },
        { element: document.querySelector('.super'), original: 'ZineButtons/superkidbutton1.png', hover: 'ZineButtons/superkidbuttonopen2.png' },
        { element: document.querySelector('.Img1'), original: 'BansheePage/leftbansheebutton1.png', hover: 'BansheePage/leftbansheebutton2.png' },
        { element: document.querySelector('.Img2'), original: 'BansheePage/centerbansheebutton1.png', hover: 'BansheePage/centerbansheebutton2.png' },
        { element: document.querySelector('.Img3'), original: 'BansheePage/rightbansheebutton1.png', hover: 'BansheePage/rightbansheebutton2.png' },
        { element: document.querySelector('.Img4'), original: 'Superkidpage/Superkidsinebutton1.png', hover: 'Superkidpage/Superkidsinebutton2.png' },
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
