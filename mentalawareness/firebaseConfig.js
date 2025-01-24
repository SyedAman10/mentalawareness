import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyD09vKBZkCX9hIibJKIWNw4x-GLq-GVp9w",
  authDomain: "mentalawareness-52017.firebaseapp.com",
  projectId: "mentalawareness-52017",
  storageBucket: "mentalawareness-52017.firebasestorage.app",
  messagingSenderId: "846916793011",
  appId: "1:846916793011:web:c4bdd5d7944ef4c040f6c6",
  measurementId: "G-DRH0KDLG1V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, db };
