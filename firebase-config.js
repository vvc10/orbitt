// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX9lhl6oPGFSwc3jGapw7F17Uh0NyxPDQ",
  authDomain: "collab-app-c35f8.firebaseapp.com",
  projectId: "collab-app-c35f8",
  storageBucket: "collab-app-c35f8.firebasestorage.app",
  messagingSenderId: "913189240291",
  appId: "1:913189240291:web:5c16a0335839cacb7c34d6",
  measurementId: "G-565KH5EZZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); 