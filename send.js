document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the submit button
    document.getElementById('submit').addEventListener('click', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Execute reCAPTCHA
        grecaptcha.ready(function () {
            grecaptcha.execute('6LfN_qcpAAAAADip26Nh14bpch3kTr36TxItXmdK', { action: 'submit' }).then(function (token) {
                // Set the reCAPTCHA response token in a hidden input field
                document.getElementById('g-recaptcha-response').value = token;
                // Submit the form
                submitFormData();
            }).catch(function (error) {
                console.error('Error executing reCAPTCHA:', error);
            });
        });
    });

    // Function to submit form data
    function submitFormData() {
        // Get form data
        const name = document.querySelector('.name').value || 'Anonymous';
        const question = document.querySelector('.question').value;
        const contact = document.querySelector('.contact').value || 'N/A';
        const recaptchaResponse = document.getElementById('g-recaptcha-response').value;

        // Validate reCAPTCHA response
        if (!recaptchaResponse) {
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
            
            // Enable the submit button after successful submission
            document.getElementById('submit').disabled = false;
        }).catch(function (error) {
            console.error('Error submitting question:', error);
            alert('An error occurred. Please try again later.');
        });
    }
});
