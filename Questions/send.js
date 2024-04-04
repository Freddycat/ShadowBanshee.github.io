document.addEventListener('DOMContentLoaded', function () {
    // Initialize reCAPTCHA with your site key
    grecaptcha.ready(function () {
        grecaptcha.execute('6LfN_qcpAAAAADip26Nh14bpch3kTr36TxItXmdK', { action: 'submit' }).then(function (token) {
            // Set a hidden input field value with the token
            document.getElementById('g-recaptcha-response').value = token;
            // Enable the submit button
            document.getElementById('submit').removeAttribute('disabled');
        }).catch(function (error) {
            console.error('Error initializing reCAPTCHA:', error);
        });
    });

    document.getElementById('submit').addEventListener('click', function () {
        submitFormData();
    });

    function submitFormData() {
        const name = document.querySelector('.name').value || 'Anonymous';
        const question = document.querySelector('.question').value;
        const contact = document.querySelector('.contact').value || 'N/A';

        // Validate reCAPTCHA token
        const recaptchaResponse = document.getElementById('g-recaptcha-response').value;
        if (!recaptchaResponse) {
            alert('Please complete the reCAPTCHA verification.');
            return;
        }

        // Get a reference to the database
        const database = firebase.database();

        // Push the form data to the database
        database.ref('questions').push({
            name: name,
            question: question,
            contact: contact,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(function () {
            alert('Question submitted successfully!');
            // Clear form fields after submission
            document.querySelector('.name').value = '';
            document.querySelector('.question').value = '';
            document.querySelector('.contact').value = '';
        }).catch(function (error) {
            console.error('Error submitting question:', error);
            alert('An error occurred. Please try again later.');
        });
    }
});
