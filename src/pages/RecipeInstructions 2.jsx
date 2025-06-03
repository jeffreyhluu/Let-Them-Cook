import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Flag from "react-world-flags";
import unFlag from "../assets/un-flag.png";

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
  console.log("Recipe ID: " + recipeID);
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
          break; // ✅ important to exit the loop immediately
        }
      }

      setRecipe(foundRecipe);
      setLoading(false);
    };

    fetchRecipe();
  }, [recipeID]);

  const getCuisineFlag = (cuisine) => {
    return cuisineToFlag[cuisine] || "custom";
  };

  if (loading) return <div>Loading...</div>;
  if (!recipe) return <div>Recipe not found.</div>;

  return (
    <div className="recipe-instructions">
      <h1>{recipe.recipeName}</h1>
      <img
        src={recipe.imageURL || "https://via.placeholder.com/300"}
        alt={recipe.recipeName}
        style={{ width: 300, height: 300, objectFit: "cover" }}
      />
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
      <p>
        <strong>Difficulty:</strong>{" "}
        {["Easy", "Medium", "Hard"][recipe.difficulty - 1] || "Unknown"}
      </p>
      <p>
        <strong>Rating:</strong> {recipe.rating} / 5
      </p>
      <br></br>
      <p style={{ whiteSpace: "pre-line" }}>{recipe.instructions}</p>
    </div>
  );
};

export default RecipeInstructions;
