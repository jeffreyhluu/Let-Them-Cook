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

// Create or update user document
export async function createOrUpdateUser(userId, name, email) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // If no user document exists, create one with an empty recipes array
    await setDoc(userRef, {
      name: name ?? 'Anonymous',
      email: email ?? 'unknown@example.com',
      recipes: [] // Initialize recipes as empty since this is a new user
    });
  } else {
    // If user exists, keep the current recipes (do nothing for recipes)
    const currentData = userSnap.data();
    await setDoc(userRef, {
      name: name ?? currentData.name,
      email: email ?? currentData.email,
      recipes: currentData.recipes || [] // Ensure recipes are preserved if user exists
    });
  }
}

export async function addRecipeToUser(userId, recipe) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // If no user document exists, create one with the new recipe
    // console.log("Going into if");
    await setDoc(userRef, {
      name: recipe.name || 'Unknown',
      email: recipe.email || 'unknown@example.com',
      recipes: [recipe], // Create the recipes array with the new recipe
    });
  } else {
    // Retrieve the current recipes array and append the new recipe
    // console.log("going into else");
    // console.log("Initial recipes: " + recipes);
    console.log("Added recipe: " + recipe);
    await updateDoc(userRef, {
      recipes: arrayUnion(recipe) // Use arrayUnion to safely append the new recipe
    });
    // console.log("Later recipes: " + recipes);
  }
}

// Initialize or update the recipe ratings collection
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
