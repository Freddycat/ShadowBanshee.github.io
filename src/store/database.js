// store/user.js
import { defineStore } from 'pinia';
import { useDatabase, useDatabaseList } from 'vuefire';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { query, getDatabase, orderByChild, ref as dbRef, } from 'firebase/database';
import { ref, computed } from 'vue';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useDb = defineStore('database', () => {
  const vueDb = useDatabase();
  const db = getDatabase();
  
  const questionsRef = query(dbRef(db, 'questions'), orderByChild('timestamp'));
  const questions = useDatabaseList(questionsRef);

  const loading = ref(false);
  const error = ref(null);

  // Return the state and actions
  return {
    vueDb,
    db,
    questions,
    loading,
    error
  };
});