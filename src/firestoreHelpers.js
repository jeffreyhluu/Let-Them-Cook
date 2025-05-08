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
  const RECIPE_RATINGS_COLLECTION = 'RecipeRatingsCollection';
  
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
  
  export async function addRecipeToUser(userId, recipe) {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      // Create the user document with empty recipe array if missing
      await setDoc(userRef, {
        name: recipe.name || 'Unknown',
        email: recipe.email || 'unknown@example.com',
        recipes: [recipe]
      });
    } else {
      await updateDoc(userRef, {
        recipes: arrayUnion(recipe)
      });
    }
  }

  export async function addOrInitRecipeRating(recipe) {
    const ratingRef = doc(db, RECIPE_RATINGS_COLLECTION, recipe.recipeID);
    const ratingSnap = await getDoc(ratingRef);
  
    if (!ratingSnap.exists()) {
      await setDoc(ratingRef, {
        recipeID: recipe.recipeID,
        recipeName: recipe.recipeName || 'Untitled Recipe',
        averageRating: null // or 0 if you prefer
      });
    }
  }