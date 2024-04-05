
// Function to render reCAPTCHA widget
window.renderRecaptcha = function () {
    grecaptcha.render('recaptcha-container', {
        'sitekey': '6LfN_qcpAAAAADip26Nh14bpch3kTr36TxItXmdK'
    });
};

// Add event listener to submit button
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submit').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        // Load reCAPTCHA API script dynamically
        var script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=renderRecaptcha&render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    });
});