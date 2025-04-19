// Import Firebase modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBR08yWajAdGnMzZeYnstZBukjcS01pXnY",
  authDomain: "event-planner-7ff08.firebaseapp.com",
  projectId: "event-planner-7ff08",
  storageBucket: "event-planner-7ff08.firebasestorage.app",
  messagingSenderId: "532435918117",
  appId: "1:532435918117:web:806875d5637a372bd94ecc",
  measurementId: "G-H1NYGS1KSH"
};

// Initialize app only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export everything
export { app, db, auth, provider };
