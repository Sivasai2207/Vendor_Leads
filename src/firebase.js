// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqi6TflfSGxN_6aX0NfBRcWhOx_hSK0xQ",
  authDomain: "vendorapp-db.firebaseapp.com",
  projectId: "vendorapp-db",
  storageBucket: "vendorapp-db.appspot.com",
  messagingSenderId: "496342560134",
  appId: "1:496342560134:web:200a5ebc7fd6d35fef5007",
  measurementId: "G-7D3N04X5RW",
};

// ✅ Primary App (used for logged-in user)
const app = initializeApp(firebaseConfig);

// ✅ Secondary App (isolated for user creation)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");

// ✅ Exports
export const auth = getAuth(app);
export const secondaryAuth = getAuth(secondaryApp);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
