// Import the functions you need from the SDKs you need
import firebaseConfig from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {

    const postContainer = document.getElementById('weekly-content');

    // Check if user is logged in before fetching posts
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is logged in, proceed with fetching posts
            fetchAndDisplayAllPosts();
        } else {
            // User is not logged in, handle the situation (e.g., redirect to login)
            console.error("User is not logged in. Please sign in to view posts.");
        }
    });

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

});