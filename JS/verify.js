
import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import { getAuth, applyActionCode, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');
    const mode = urlParams.get('mode');

    if (mode === 'verifyEmail' && oobCode) {

        try {
            await applyActionCode(auth, oobCode);
            alert('Email verified successfully!');

            const modal = document.getElementById('login-modal');
            modal.style.display = 'block';

            const loginForm = document.getElementById('login-form');


            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const identifier = document.getElementById('login-username-email').value;
                const password = document.getElementById('login-password').value;
                const errorMessage = document.getElementById('error-message');
                try {
                    let email = identifier;

                    if (!identifier.includes('@')) {
                        email = await getEmail(identifier);
                        if (!email) {
                            throw new Error(`User "${identifier}" not found, did you mean something else?`);
                        }
                    }

                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    console.log('User signed in:', userCredential.user);

                    // Update Firestore status to "verified"
                    const user = auth.currentUser;
                    if (user && user.emailVerified) {
                        const userDocRef = doc(db, 'users', username);
                        await updateDoc(userDocRef, { status: 'verified' });
                        console.log('User status updated to verified in Firestore.');
                        window.location.href = '/index'; // Example: redirect to a dashboard

                    } else {
                        console.warn('User is not verified after applying action code.');
                    }
                } catch (signInError) {
                    console.error('Error signing in after verifying email:', signInError);
                    errorMessage.textContent = 'Failed to sign in. Please try again.';
                }
            });

        } catch (error) {
            console.error('Error verifying email:', error);
            alert('Failed to verify email. Please try again.');
        }
    } else {
        alert('Invalid verification link.');
    }
});

async function getEmail(username) {
    try {
        const response = await fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/get-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        if (!response.ok) {
            console.error('Server response:', await response.json());
            throw new Error('Failed to fetch email from server');
        }

        const data = await response.json();
        return data.email;
    } catch (error) {
        console.error('Error fetching email from server:', error);
        return null;
    }
}