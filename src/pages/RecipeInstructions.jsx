// src/pages/RecipeInstructions.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Flag from "react-world-flags";
import unFlag from "../assets/un-flag.png";
import "./css/RecipeInstructions.css"; // ✅ New CSS file

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

const RecipeInstructions = () => {
  const { recipeID } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const usersRef = collection(db, "UsersCollection");
      const snapshot = await getDocs(usersRef);

      let foundRecipe = null;

      for (const docSnap of snapshot.docs) {
        const userData = docSnap.data();
        const match = userData.recipes?.find((r) => r.recipeID === recipeID);
        if (match) {
          foundRecipe = match;
          break;
        }
      }

      setRecipe(foundRecipe);
      setLoading(false);
    };

    fetchRecipe();
  }, [recipeID]);

  const getCuisineFlag = (cuisine) => cuisineToFlag[cuisine] || "custom";

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (!recipe) return <div className="error">Recipe not found.</div>;

  return (
    <div className="recipe-instructions-page">
      <div className="recipe-header">
        <img
          src={recipe.imageURL || "https://via.placeholder.com/300"}
          alt={recipe.recipeName}
          className="recipe-image"
        />
        <div className="recipe-meta">
          <h1>{recipe.recipeName}</h1>
          <p>
            <strong>Cuisine:</strong> {recipe.cuisineType}{" "}
            {getCuisineFlag(recipe.cuisineType) === "custom" ? (
              <img src={unFlag} alt="UN Flag" className="flag-icon" />
            ) : (
              <Flag code={getCuisineFlag(recipe.cuisineType)} className="flag-icon" />
            )}
          </p>
          <p>
            <strong>Difficulty:</strong>{" "}
            {["Easy", "Medium", "Hard"][recipe.difficulty - 1] || "Unknown"}
          </p>
          <p>
            <strong>Your Rating:</strong>{" "}
            {recipe.rating ? `${recipe.rating.toFixed(1)} / 5 ⭐` : "Not rated yet"}
          </p>
        </div>
      </div>

      <div className="instructions-section">
        <h2>Instructions</h2>
        <p className="recipe-text">{recipe.instructions}</p>
      </div>
    </div>
  );
};

export default RecipeInstructions;
