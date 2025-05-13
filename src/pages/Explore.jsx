import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import Flag from "react-world-flags";
import unFlag from "../assets/un-flag.png";
import axios from "axios";
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
  const [loading, setLoading] = useState(true);
  const [recipeImages, setRecipeImages] = useState({});

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

        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const partialStars = Math.round((rating - fullStars) * 10);
    let starArray = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starArray.push("⭐");
      } else if (i === fullStars && partialStars > 0) {
        starArray.push("⭐️");
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
              <p><strong>Rating:</strong> {renderStars(recipe.rating)}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No recipes to explore yet.</p>
      )}
    </div>
  );
};

export default Explore;
