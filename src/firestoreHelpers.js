import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'UsersCollection';
const RECIPE_RATINGS_COLLECTION = 'RecipeRatingsCollection';

export async function getAllUserRecipes() {
  const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
  const allRecipes = [];

  usersSnapshot.forEach(userDoc => {
    const userId = userDoc.id;
    const userData = userDoc.data();

    const userRecipes = userData.recipes || [];
    userRecipes.forEach(recipe => {
      allRecipes.push({
        ...recipe,
        userId 
      });
    });
  });

  return allRecipes;
}

export async function getAllRatedRecipes() {
  const ratingsSnapshot = await getDocs(collection(db, RECIPE_RATINGS_COLLECTION));
  const recipes = [];

  ratingsSnapshot.forEach(doc => {
    const data = doc.data();
    recipes.push(data);
  });

  return recipes;
}

export async function userHasRecipe(userId, recipeID) {
  const userData = await getUserData(userId);
  if (!userData || !userData.recipes) return false;

  return userData.recipes.some(recipe => recipe.recipeID === recipeID);
}

/**
 * Finds the userID of the user who owns the recipe with the given recipeID.
 * @param {string} recipeID - The ID of the recipe to search for.
 * @returns {Promise<string|null>} - The userID if found, otherwise null.
 */
export async function getUserIDByRecipeID(recipeID) {
  try {
    const usersSnapshot = await getDocs(collection(db, "UsersCollection"));

    for (const userDoc of usersSnapshot.docs) {
      const userID = userDoc.id;
      const userData = userDoc.data();

      const recipes = userData.recipes || [];

      // If recipes is an array of objects with a recipeID field
      const hasRecipe = recipes.some(recipe => recipe.recipeID === recipeID);

      if (hasRecipe) {
        return userID;
      }
    }

    return null; 
  } catch (error) {
    console.error("Error getting user by recipe ID:", error);
    return null;
  }
}

export async function copyRecipeToUser(fromUserId, toUserId, recipeID) {
  const fromUserRef = doc(db, USERS_COLLECTION, fromUserId);
  const toUserRef = doc(db, USERS_COLLECTION, toUserId);

  const fromUserSnap = await getDoc(fromUserRef);
  const toUserSnap = await getDoc(toUserRef);

  if (!fromUserSnap.exists()) {
    throw new Error(`Source user with ID ${fromUserId} does not exist.`);
  }

  if (!toUserSnap.exists()) {
    throw new Error(`Destination user with ID ${toUserId} does not exist.`);
  }

  const fromUserData = fromUserSnap.data();
  const recipeToCopy = fromUserData.recipes?.find(r => r.recipeID === recipeID);

  if (!recipeToCopy) {
    throw new Error(`Recipe with ID ${recipeID} not found for user ${fromUserId}.`);
  }

  await updateDoc(toUserRef, {
    recipes: arrayUnion(recipeToCopy)
  });
}


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
      averageRating: null 
    });
  }
}

// Update RecipeRatingsCollection
export async function updateRecipeRatingForUser(uid, recipeID, newRating) {
  const ratingRef = doc(db, "RecipeRatingsCollection", recipeID);
  const ratingSnap = await getDoc(ratingRef);

  if (!ratingSnap.exists()) {
    throw new Error(`No recipe ratings found for recipeID: ${recipeID}`);
  }

  const data = ratingSnap.data();
  const currentAverage = data.averageRating || 0;
  const currentCount = data.ratingCount || 0;

  // Step 1: Fetch user's local recipe data
  const userDocRef = doc(db, "UsersCollection", uid);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) return;

  const userData = userDocSnap.data();
  let userHasRatedBefore = false;
  let oldRating = 0;

  const updatedRecipes = userData.recipes.map((r) => {
    if (r.recipeID === recipeID) {
      userHasRatedBefore = r.ifRated === true;
      oldRating = r.rating || 0;
      return { ...r, rating: newRating, ifRated: true };
    }
    return r;
  });

  // Step 2: Calculate new total and count
  let newTotal;
  let newCount = currentCount;

  if (userHasRatedBefore) {
    // Update total without changing count
    newTotal = currentAverage * currentCount - oldRating + newRating;
  } else {
    // First rating: add and increment count
    newTotal = currentAverage * currentCount + newRating;
    newCount += 1;
  }

  const newAverage = newTotal / newCount;

  // Step 3: Save updates
  await updateDoc(ratingRef, {
    averageRating: newAverage,
    ratingCount: newCount,
  });

  await updateDoc(userDocRef, {
    recipes: updatedRecipes,
  });
}
