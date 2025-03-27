import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyALw8UxOyC8K3Yo7A88Dt4QqVdJT_RHF7M",
    authDomain: "music-application-cbce2.firebaseapp.com",
    databaseURL: "https://music-application-cbce2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "music-application-cbce2",
    storageBucket: "music-application-cbce2.appspot.com",
    messagingSenderId: "102017998132",
    appId: "1:102017998132:web:30261ae8ce46a6ef085961",
    measurementId: "G-8KGDQDE42Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
export { db, auth, storage, googleProvider };