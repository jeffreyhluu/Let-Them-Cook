// firestoreHelpers.js
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  const USERS_COLLECTION = 'UsersCollection';
  
  // Get user data
  export async function getUserData(userId) {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }
  
  // Create or overwrite user document
  export async function createOrUpdateUser(userId, name, email) {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, {
      name,
      email,
      recipes: []
    });
  }
  
  // Add a recipe to user's list
  export async function addRecipeToUser(userId, recipe) {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      recipes: arrayUnion(recipe)
    });
  }