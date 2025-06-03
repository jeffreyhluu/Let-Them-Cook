import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
 apiKey: "AIzaSyARO8Tz9yaLxfrk4Mtp47mae2ZdCUqfKmA",
 authDomain: "let-them-cook-1d7b3.firebaseapp.com",
 projectId: "let-them-cook-1d7b3",
 storageBucket: "let-them-cook-1d7b3.firebasestorage.app",
 messagingSenderId: "17302478084",
 appId: "1:17302478084:web:4889ad98a5dbf8b6924451",
 measurementId: "G-JB5KNZF5W2"
};


const app = initializeApp(firebaseConfig);
let analytics;
try {
 analytics = getAnalytics(app);
} catch (error) {
 console.log("Analytics initialization skipped");
}


const auth = getAuth(app);
const provider = new GoogleAuthProvider();


const db = getFirestore(app);


const storage = getStorage(app);


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
