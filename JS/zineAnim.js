const buttons = document.querySelectorAll('.Img2, .Img3, .Img4');

buttons.forEach(button => {
    const defaultTransform = window.getComputedStyle(button).transform;

    button.addEventListener('mouseenter', () => {
        buttons.forEach(otherButton => {
            if (otherButton !== button) {
                const deltaX = button.offsetLeft - otherButton.offsetLeft;
                otherButton.style.transform = `translateX(${deltaX > 0 ? -20 : 20}px)`;
            }
        });
    });

    button.addEventListener('mouseleave', () => {
        buttons.forEach(otherButton => {
            if (otherButton !== button) {
                otherButton.style.transform = defaultTransform;
            }
        });
    });
});

function link(url) {
    window.open(url, '_blank');
}