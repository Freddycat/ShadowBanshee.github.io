document.addEventListener('DOMContentLoaded', function () {
    let recaptchaToken = null; // Initialize variable to store reCAPTCHA token

    // Function to enable or disable the submit button based on reCAPTCHA status
    function updateSubmitButton() {
        const submitButton = document.getElementById('submit');
        submitButton.disabled = !recaptchaToken; // Disable button if reCAPTCHA token is not set
    }

    // Add event listener to the recaptcha widget
    document.querySelector('.g-recaptcha').addEventListener('change', function (event) {
        recaptchaToken = event.target.value; // Update reCAPTCHA token when it changes
        updateSubmitButton(); // Update submit button status
    });

    // Function to submit form data
    function submitFormData() {
        // Get form data
        const name = document.querySelector('.name').value || 'Anonymous';
        const question = document.querySelector('.question').value;
        const contact = document.querySelector('.contact').value || 'N/A';

        // Validate reCAPTCHA response
        if (!recaptchaToken) {
            alert('Please complete the reCAPTCHA verification.');
            return;
        }

        // Firebase database reference
        const database = firebase.database();

        // Push form data to Firebase database
        database.ref('questions').push({
            name: name,
            question: question,
            contact: contact,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(function () {
            // Reset form fields
            document.querySelector('.name').value = '';
            document.querySelector('.question').value = '';
            document.querySelector('.contact').value = '';
            // Show success message
            alert('Question submitted successfully!');
        }).catch(function (error) {
            console.error('Error submitting question:', error);
            alert('An error occurred. Please try again later.');
        });
    }

    // Add event listener to the form for form submission
    document.querySelector('form').addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Submit the form data
        submitFormData();
    });
});
