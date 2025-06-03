// store/admin.js
import { defineStore } from 'pinia';
import {
  useFirebaseAuth,
  useFirestore,
  useCurrentUser,
  useDocument,
  useFirebaseStorage,
  useStorage,
} from 'vuefire';

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, addDoc, collection, getFirestore } from 'firebase/firestore';
import { ref, computed } from 'vue';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAdmin = defineStore('admin', () => {
  const firebaseStorage = useFirebaseStorage();
  const storage = useStorage(firebaseStorage);
  const firestore = useFirestore();

  const uploadProgress = ref(0);
  const uploadError = ref(null);
  const uploadedImageUrl = ref(null);

  async function uploadImage(file, storagePath) {
    uploadProgress.value = 0;
    uploadError.value = null;
    uploadedImageUrl.value = null;

    try {
      // Create a storage reference
      const reference = storageRef(storage, storagePath);

      // Upload the file
      const task = uploadBytes(reference, file);

      // Wait for the upload to complete
      await task;

      // Get the download URL
      uploadedImageUrl.value = await getDownloadURL(reference);
      console.log('Image uploaded successfully. URL:', uploadedImageUrl.value);

      return uploadedImageUrl.value; // Return the URL for further use
    } catch (error) {
      uploadError.value = error.message;
      console.error('Error during image upload:', error);
      return null;
    }
  }

  function SavePost(subject, text) {
    console.log(API_BASE_URL);
    return fetch(`${API_BASE_URL}/save-post`, {
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

  async function AddItem() {
    try {
      const docRef = await addDoc(collection(fs, "items"), {
        name: "tsbp1",
        type: "zine",
        price: "7",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return {
    firebaseStorage,
    firestore,
    storage,
    uploadProgress,
    uploadError,
    uploadedImageUrl,
    uploadImage,
    SavePost,
    AddItem
  };
});