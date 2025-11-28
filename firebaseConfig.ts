
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Placeholder config - The app will detect if these are still placeholders
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
