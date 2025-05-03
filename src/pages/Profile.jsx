import React, { useState, useEffect } from "react";
import { auth } from "../firebase";

const Profile = () => {
  const [displayName, setDisplayName] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [shoppingList, setShoppingList] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, []);

  const handleSave = () => {
    console.log("Saved info:");
    console.log("Display Name:", displayName);
    console.log("Dietary Restrictions:", dietaryRestrictions);
    console.log("Shopping List:", shoppingList);

    // Example placeholder for the chatbot logic:
    // 1. Save to Firestore or Firebase Realtime DB if desired
    // 2. Update chatbot context/state if it exists

    // Example (pseudo):
    // chatbot.setContext({
    //   name: displayName,
    //   restrictions: dietaryRestrictions,
    //   shoppingItems: shoppingList.split('\n')
    // });

    alert("Profile information saved!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-500 mb-6">User Profile</h1>

      {/* Profile Info Section */}
      <section className="mb-8 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <label className="block mb-2 font-medium">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Your name"
        />
      </section>

      {/* Dietary Restrictions Section */}
      <section className="mb-8 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Dietary Restrictions</h2>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={dietaryRestrictions}
          onChange={(e) => setDietaryRestrictions(e.target.value)}
          placeholder="E.g., vegetarian, gluten-free, nut allergy..."
        />
      </section>

      {/* Shopping List Section */}
      <section className="mb-8 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Shopping List</h2>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={shoppingList}
          onChange={(e) => setShoppingList(e.target.value)}
          placeholder="E.g., Milk, Eggs, Bread..."
        />
      </section>

      {/* Save Button */}
      <div className="text-right">
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;