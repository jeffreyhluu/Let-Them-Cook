// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyARO8Tz9yaLxfrk4Mtp47mae2ZdCUqfKmA",
 authDomain: "let-them-cook-1d7b3.firebaseapp.com",
 projectId: "let-them-cook-1d7b3",
 storageBucket: "let-them-cook-1d7b3.firebasestorage.app",
 messagingSenderId: "17302478084",
 appId: "1:17302478084:web:4889ad98a5dbf8b6924451",
 measurementId: "G-JB5KNZF5W2"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
try {
 analytics = getAnalytics(app);
} catch (error) {
 // Analytics might fail in certain environments like SSR
 console.log("Analytics initialization skipped");
}


// Initialize Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// Initialize Firestore
const db = getFirestore(app);


// Initialize Storage
const storage = getStorage(app);


// Helper function for user profile data
const updateUserProfile = (user) => {
 if (user) {
   return {
     displayName: user.displayName,
     email: user.email,
     photoURL: user.photoURL,
     uid: user.uid
   };
 }
 return null;
};


export { auth, provider, db, storage, updateUserProfile };
