// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo3TaqD6hPJOOcwMoorHQOOTeJNnzADxA",
  authDomain: "revenue-sync.firebaseapp.com",
  projectId: "revenue-sync",
  storageBucket: "revenue-sync.firebasestorage.app",
  messagingSenderId: "512973022370",
  appId: "1:512973022370:web:9e97d68faea0e78ac5e3fb",
  measurementId: "G-K2GL2ME7L0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


export { auth, googleProvider };