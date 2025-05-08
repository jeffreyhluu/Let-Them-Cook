import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Make sure to import your Firestore setup
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom"; // For linking to the recipe instructions page
import Flag from "react-world-flags"; // For cuisine flags

const Explore = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const userRef = collection(db, "UsersCollection"); // Collection of users
        const q = query(userRef, where("email", "==", "dsother07@gmail.com")); // Use logged-in user's email
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.recipes) {
            setRecipes(userData.recipes);
          }
        });
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
        return "Unknown"; // If difficulty is NaN
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
            <img src={recipe.image || "https://via.placeholder.com/150"} alt={recipe.recipeName} className="recipe-image" />
            <div className="recipe-details">
              <h3>
                <Link to={`/recipe/${recipe.recipeID}`}>{recipe.recipeName}</Link>
              </h3>
              <p><strong>Cuisine:</strong> {recipe.cuisineType} <Flag code="US" style={{ width: 20, height: 15 }} /></p>
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
