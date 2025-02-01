// Import the functions you need from the SDKs you need
import firebaseConfig from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const db = getFirestore(app);

// Check if user is admin
document.addEventListener("DOMContentLoaded", function () {

  onAuthStateChanged(auth, async (user) => {  // Make callback async
    if (user) {
      try {
        const tokenResult = await user.getIdTokenResult(); // Get token
        const isAdmin = tokenResult.claims.admin === true; // Check claim

        if (!isAdmin) {
          alert('Access denied. Admins only.');
          window.location.href = 'index';
        } else {
          // User is an admin.  Proceed with loading the admin page content.
          // ... your admin page initialization code here ...
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        alert('Error checking admin status.');
        window.location.href = 'index';
      }
    } else {
      alert('You must be logged in to access this page.');
      window.location.href = 'index';
    }
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

  // Insert image for user
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

  // get snapshots
  const postContainer = document.getElementById('posts');
  fetchAndDisplayAllPosts();

  fetchAndDisplayAllUsers();

  async function fetchAndDisplayAllPosts() {
    try {
      const querySnapshot = await getDocs(query
        (collection(db, "weeklyPosts"),
          orderBy("createdAt", "desc")
        ));
      querySnapshot.forEach((doc) => {
        const postId = doc.id;
        fetchAndDisplayPost(postId);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  async function fetchAndDisplayPost(postId) {
    try {
      const docRef = doc(db, "weeklyPosts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();


        const postDiv = document.createElement('div');
        postDiv.classList.add('post'); // Add a CSS class for styling (optional)          

        const postContent = document.createElement('p');
        postContent.innerHTML = postData.content;
        postDiv.appendChild(postContent);

        // Render images
        if (postData.imageUrl) {
          postData.imageUrl.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            postContainer.appendChild(img);
          });
        }

        postContainer.appendChild(postDiv);

      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
      // Handle the error (e.g., display an error message to the user)
    }
  }

  const userContainer = document.getElementById('users');

  async function fetchAndDisplayUser(user) {
    try {
      const docRef = doc(db, "users", user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        const userDiv = document.createElement('div');
        userDiv.classList.add('user'); // Add a CSS class for styling (optional)          

        const userContent = document.createElement('p');
        userContent.innerHTML = userData.username;
        userDiv.appendChild(userContent);
        userContainer.appendChild(userDiv);

        // Display the content (iterate through the data)
        for (const key in userData) { // Iterate through the properties of userData
          if (userData.hasOwnProperty(key)) { // Check if it's the object's own property
            const contentElement = document.createElement('p');

            // Handle different data types:
            if (typeof userData[key] === 'object') {
              // If it's an object, stringify it or display its properties (recursively if needed)
              contentElement.textContent = `${key}: ${JSON.stringify(userData[key])}`; // Or format it better
            } else {
              contentElement.textContent = `${key}: ${userData[key]}`;
            }

            userDiv.appendChild(contentElement);
          }
        }

      } else {
        console.error("No user!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
      // Handle the error (e.g., display an error message to the user)
    }
  }

  async function fetchAndDisplayAllUsers() {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, orderBy('createdAt')); // Define the query!

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => { // Use doc here
        const userId = doc.id; // Get the user's ID
        fetchAndDisplayUser(userId); // Pass the ID to fetchAndDisplayUser
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
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

  const sendEmailForm = document.getElementById("email");
  if (sendEmailForm) {
    sendEmailForm.addEventListener("click", function (event) {
      event.preventDefault();
      const subject = document.getElementById("email-subject").value;
      let text = quill.root.innerHTML; // Get the content from Quill editor

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const images = doc.querySelectorAll('img');

      images.forEach(img => {
        const originalSrc = img.getAttribute('src');
        const decodedSrc = decodeURIComponent(originalSrc);
        const encodedSrc = encodeURI(decodedSrc);
        img.setAttribute('src', encodedSrc);
        img.style.maxWidth = '65%'; // Set style directly on the element
      });

      text = doc.body.innerHTML;

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

});