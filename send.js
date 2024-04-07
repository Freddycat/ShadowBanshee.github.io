document.addEventListener('DOMContentLoaded', function () {
    let recaptchaToken = null; // Initialize variable to store reCAPTCHA token

    // Function to enable or disable the submit button based on reCAPTCHA status
    function updateSubmitButton() {
        const submitButton = document.getElementById('submit');
        submitButton.disabled = !recaptchaToken; // Disable button if reCAPTCHA token is not set
        console.log("Submit button status updated. Disabled:", submitButton.disabled);
    }

    // Add event listener to the recaptcha widget
    document.querySelector('.g-recaptcha').addEventListener('change', function (event) {
        recaptchaToken = event.target.value; // Update reCAPTCHA token when it changes
        updateSubmitButton(); // Update submit button status
        console.log("reCAPTCHA token updated:", recaptchaToken);
    });

    // Function to submit form data
    function submitFormData() {
        console.log("Form data submitted.");
        // Rest of the code remains the same
    }

    // Add event listener to the form for form submission
    document.querySelector('form').addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Submit the form data
        submitFormData();
    });
});
