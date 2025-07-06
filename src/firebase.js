// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTN8fQzd9h3tQbsw61Z4DEB7DFKnCkFbw",
  authDomain: "vendor-leadsdb.firebaseapp.com",
  projectId: "vendor-leadsdb",
  storageBucket: "vendor-leadsdb.firebasestorage.app",
  messagingSenderId: "164472324878",
  appId: "1:164472324878:web:e02cf484a8d209dfa74d5f",
  measurementId: "G-PHM3N43FZK"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
