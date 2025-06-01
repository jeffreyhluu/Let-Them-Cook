import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import Flag from "react-world-flags";
import unFlag from "../assets/un-flag.png";
import axios from "axios";
import { updateRecipeRatingForUser } from "../firestoreHelpers";
import './css/Explore.css';

const cuisineToFlag = {
  Italian: "IT",
  Mexican: "MX",
  Japanese: "JP",
  Indian: "IN",
  Chinese: "CN",
  French: "FR",
  American: "US",
  Brazilian: "BR",
  Spanish: "ES",
  Greek: "GR",
  Thai: "TH",
  Vietnamese: "VN",
};

const Explore = () => {
  const [recipes, setRecipes] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState({});

  const fetchImageForRecipe = async (recipeName) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt: `A realistic photo of a dish called ${recipeName}`,
          n: 1,
          size: "256x256",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      return response.data.data[0].url;
    } catch (error) {
      console.error(`Error fetching image for ${recipeName}:`, error);
      return "https://via.placeholder.com/150";
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("No user is logged in.");
          setLoading(false);
          return;
        }

        const userRef = collection(db, "UsersCollection");
        const q = query(userRef, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        let loadedRecipes = [];
        const docUpdates = [];

        for (const docSnap of querySnapshot.docs) {
          const userData = docSnap.data();
          if (userData.recipes) {
            const updatedRecipes = await Promise.all(
              userData.recipes.map(async (recipe) => {
                if (!recipe.imageURL) {
                  const imageURL = await fetchImageForRecipe(recipe.recipeName);
                  recipe.imageURL = imageURL;
                  docUpdates.push({ docId: docSnap.id, updatedRecipes: [...userData.recipes] });
                }
                return recipe;
              })
            );
            loadedRecipes = updatedRecipes;
          }
        }

        setRecipes(loadedRecipes);

        for (const { docId, updatedRecipes } of docUpdates) {
          const userDocRef = doc(db, "UsersCollection", docId);
          await updateDoc(userDocRef, { recipes: updatedRecipes });
        }

        // Fetch average ratings here
        const ratings = {};
        for (const recipe of loadedRecipes) {
          const ratingDocRef = doc(db, "RecipeRatingsCollection", recipe.recipeID);
          const ratingDocSnap = await getDoc(ratingDocRef);
          if (ratingDocSnap.exists()) {
            ratings[recipe.recipeID] = ratingDocSnap.data().averageRating || 0;
          } else {
            ratings[recipe.recipeID] = 0;
          }
        }
        console.log("Ratings: " + ratings);
        setAverageRatings(ratings);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchRecipes();

  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.round(rating);
    let starArray = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starArray.push("⭐");
      } else {
        starArray.push("☆");
      }
    }

    return starArray.join("");
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Unknown";
    }
  };

  const getCuisineFlag = (cuisine) => {
    return cuisineToFlag[cuisine] || "custom";
  };

  const handleRatingChange = (recipeID, newRating) => {
    setUserRatings((prev) => ({
      ...prev,
      [recipeID]: newRating,
    }));
  };

  const handleRatingSubmit = async (recipeID) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("You must be logged in to rate recipes.");
      return;
    }

    const newRating = userRatings[recipeID];
    if (!newRating) return;

    try {
      await updateRecipeRatingForUser(currentUser.uid, recipeID, Number(newRating));
      alert("Rating submitted!");
      setRecipes((prev) =>
        prev.map((r) => r.recipeID === recipeID ? { ...r, rating: Number(newRating), ifRated: true } : r)
      );
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="explore">
      <h1>Explore Recipes</h1>
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe.recipeID} className="recipe-card">
            <Link to={`/recipe/${recipe.recipeID}`}>
              <img
                src={recipe.imageURL || "https://via.placeholder.com/150"}
                alt={recipe.recipeName}
                className="recipe-image"
              />
            </Link>
            <div className="recipe-details">
              <h3>
                <Link to={`/recipe/${recipe.recipeID}`}>{recipe.recipeName}</Link>
              </h3>
              <p>
                <strong>Cuisine:</strong> {recipe.cuisineType}
                {getCuisineFlag(recipe.cuisineType) === "custom" ? (
                  <img
                    src={unFlag}
                    alt="UN Flag"
                    style={{ width: 20, height: 15, marginLeft: 8 }}
                  />
                ) : (
                  <Flag
                    code={getCuisineFlag(recipe.cuisineType)}
                    style={{ width: 20, height: 15, marginLeft: 8 }}
                  />
                )}
              </p>
              <p><strong>Difficulty:</strong> {getDifficultyText(recipe.difficulty)}</p>
              <p>
                <strong>Your Rating:</strong>{" "}
                {renderStars(recipe.rating)}
              </p>
              <p>
                <strong>Average Rating:</strong>{" "}
                {averageRatings[recipe.recipeID] > 0
                  ? `${renderStars(averageRatings[recipe.recipeID])} (${averageRatings[recipe.recipeID].toFixed(1)}/5.0)`
                  : "No ratings from any users yet"}
              </p>
            </div>
  
            {recipe.ifRated ? (
              <p><em>You've already rated this recipe.</em></p>
            ) : (
              <div className="rating-input">
                <label>
                  Rate this recipe:
                  <select
                    value={userRatings[recipe.recipeID] || ""}
                    onChange={(e) => handleRatingChange(recipe.recipeID, e.target.value)}
                  >
                    <option value="">--</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <button onClick={() => handleRatingSubmit(recipe.recipeID)}>Submit</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No recipes to explore yet.</p>
      )}
    </div>
  );
  };
  
  export default Explore;