import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, collection, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator, ref as dbRef } from 'firebase/database';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import firebaseConfig from '@/firebase/firebase-config';

export const firebaseApp = initializeApp(firebaseConfig);

// used for the databas refs
const db = getDatabase(firebaseApp)
const fs = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp); // Initialize auth
const functions = getFunctions(firebaseApp);
const storage = getStorage(firebaseApp);

const isDev = import.meta.env.DEV;

if (isDev) {
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectDatabaseEmulator(db, "localhost", 9000);
    connectFirestoreEmulator(fs, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectStorageEmulator(storage, "localhost", 9199);
}
// here we can export reusable database references
export const todosRef = dbRef(db, 'todos');
export const todosCollection = collection(fs, 'todos')