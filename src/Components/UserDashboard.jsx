import React, { useEffect, useState } from 'react';
import { getUserData, createOrUpdateUser, addRecipeToUser } from '../firestoreHelpers';

const sampleRecipe = {
  recipeID: 'uuid-1234',
  ingredients: 'chicken, garlic, onion',
  rating: 5,
  difficulty: 3,
  cuisineType: 'Thai',
  dietary: 0,
  saved: true
};

function UserDashboard({ userId, name, email }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getUserData(userId);
      if (!data) {
        await createOrUpdateUser(userId, name, email);
      }
      const updatedData = await getUserData(userId);
      setUserData(updatedData);
    };
    fetch();
  }, [userId, name, email]);

  const handleAddRecipe = async () => {
    await addRecipeToUser(userId, sampleRecipe);
    const updatedData = await getUserData(userId);
    setUserData(updatedData);
  };

  return (
    <div>
      <h1>Welcome, {userData?.name || name}</h1>
      <button onClick={handleAddRecipe}>Add Sample Recipe</button>
      <h2>Your Recipes:</h2>
      <ul>
        {userData?.recipes?.map((recipe, idx) => (
          <li key={idx}>
            {recipe.cuisineType} - Rating: {recipe.rating} - Difficulty: {recipe.difficulty}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDashboard;