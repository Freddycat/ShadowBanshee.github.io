const alertQueue = [];
let isAlertVisible = false;

function setAlert(message, type = 'error', duration = 5000) {
    alertQueue.push({ message, type, duration });
    if (!isAlertVisible) {
        processQueue();
    }
}

function processQueue() {
    if (alertQueue.length === 0) {
        isAlertVisible = false;
        return;
    }

    isAlertVisible = true;
    const { message, type, duration } = alertQueue.shift();
    const alertContainer = document.getElementById('alert');

    // Create the alert box
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');

    // Add the message
    alertBox.innerHTML = `
        <span>${message}</span>
    `;

    // Append to container
    alertContainer.prepend(alertBox);

    // Auto-remove after duration
    setTimeout(() => {
        alertBox.style.animation = 'slide-up 0.5s ease forwards';
        alertBox.addEventListener('animationend', () => {
                alertBox.remove();
                isAlertVisible = false;
                processQueue();
        });
    }, duration);
}

// Example usage
//setAlert('This is an error message.', 'error'); // Red alert
//setAlert('This is a success message.', 'success', 3000); // Green alert
