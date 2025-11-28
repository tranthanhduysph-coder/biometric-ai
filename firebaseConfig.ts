import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Placeholder config - The app will detect if these are still placeholders
const firebaseConfig = {
  apiKey: "AIzaSyBrI0ak_xI-HPyFUfwcP0lsmNELGZx60_g",
  authDomain: "biometric-ai.firebaseapp.com",
  projectId: "biometric-ai",
  storageBucket: "biometric-ai.firebasestorage.app",
  messagingSenderId: "63249534834",
  appId: "1:63249534834:web:7aa0f7da5d35b7c70417eb",
  measurementId: "G-MQFRJ4JDPH"
};

// Check if the user has actually set up their keys
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app: firebase.app.App | undefined;
let auth: firebase.auth.Auth | undefined;
let db: firebase.firestore.Firestore | undefined;

if (isFirebaseConfigured) {
  try {
    // Prevent multiple initializations
    if (!firebase.apps.length) {
      app = firebase.initializeApp(firebaseConfig);
    } else {
      app = firebase.app();
    }
    auth = firebase.auth();
    db = firebase.firestore();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase keys are missing. Running in DEMO MODE.");
}

export { auth, db };