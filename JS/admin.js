// Import the functions you need from the SDKs you need
import firebaseConfig from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);


// Check if user is admin

function checkAdmin(uid) {
  return fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/checkAdmin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid }),
  }).then(response => response.json());
}

function sendEmailToSubscribed(subject, text) {
  return fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/sendEmailToSubscribed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, text }),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the response as JSON
  });
}

function savePost(subject, text) {
  return fetch('https://us-central1-shadowbanshee-79c70.cloudfunctions.net/api/savePost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, text }),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the response as JSON
  });
}

document.addEventListener("DOMContentLoaded", function () {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      checkAdmin(user.uid).then(data => {
        if (!data.isAdmin) {
          alert('Access denied. Admins only.');
          window.location.href = 'index';
        }
      }).catch((error) => {
        console.error('Error checking admin status:', error);
        alert('Error checking admin status.');
        window.location.href = 'index';
      });
    } else {
      alert('You must be logged in to access this page.');
      window.location.href = 'index';
    }
  });
});

// Initialize Quill editor with image upload option
const quill = new Quill('#editor-container', {
  theme: 'snow',
  modules: {
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        [{ 'font': [] }], // Adds a font dropdown
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ],
      handlers: {
        'image': function () {
          document.getElementById('image-upload').click();
        }
      }
    }
  }
});

const sendEmailForm = document.getElementById("email");
if (sendEmailForm) {
  sendEmailForm.addEventListener("click", function (event) {
      event.preventDefault();
      const subject = document.getElementById("email-subject").value;
      const text = quill.root.innerHTML; // Get the content from Quill editor

      console.log('Sending email with subject:', subject);
      console.log('Email content:', text);

      sendEmailToSubscribed(subject, text).then(() => {
          alert('Email sent to subscribed users.');
      }).catch((error) => {
          console.error('Error sending email:', error);
          alert('Error sending email.');
      });
  });
}

//save post

const savePostForm = document.getElementById("weekly");
if (savePostForm) {
  savePostForm.addEventListener("click", function (event) {
      event.preventDefault();
      const subject = document.getElementById("email-subject").value;
      const text = quill.root.innerHTML; // Get the content from Quill editor

      console.log('Saving post with subject:', subject);
      console.log('Post content:', text);

      savePost(subject, text).then(() => {
          alert('Saved post to weekly.');
      }).catch((error) => {
          console.error('Error saving:', error);
          alert('Error saving.');
      });
  });
}

//save email content to database

document.getElementById('send-email-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const content = quill.root.innerHTML;
  set(ref(database, 'emailContent'), { content: content })
    .then(() => {
      alert('Email content saved and email will be sent!');
    })
    .catch((error) => {
      console.error('Error saving email content:', error);
    });
});

document.getElementById('image-upload').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const storageReference = storageRef(storage, 'images/' + file.name);
    uploadBytes(storageReference, file).then(() => {
      getDownloadURL(storageReference).then((url) => {
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
      });
    });
  }
});

