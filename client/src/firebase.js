// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernestate-a651e.firebaseapp.com",
  projectId: "mernestate-a651e",
  storageBucket: "mernestate-a651e.appspot.com",
  messagingSenderId: "287377614644",
  appId: "1:287377614644:web:dc759fd31e4cd70cbf2761"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);