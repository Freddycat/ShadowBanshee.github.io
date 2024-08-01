document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the form
    const form = document.getElementById('questionForm');

    // Add event listener to the form for form submission
    form.addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Submit the form data
        submitFormData();
    });

    function submitFormData() {
        const name = document.querySelector('.name').value || 'Anonymous';
        const question = document.querySelector('.question').value;
        const contact = document.querySelector('.contact').value || 'N/A';

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
            form.reset();
        }).catch(function (error) {
            console.error('Error submitting question:', error);
            alert('An error occurred. Please try again later.');
        });
    }
});
