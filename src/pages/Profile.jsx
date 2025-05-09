import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import './css/input.css'; // Make sure to import the CSS file

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

    alert("Profile information saved!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-500 mb-6">User Profile</h1>

      {/* Profile Info Section */}
      <section className="profile-section">
        <h2 className="section-title">Profile Information</h2>
        <label className="label">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="input"
          placeholder="Your name"
        />
      </section>

      {/* Dietary Restrictions Section */}
      <section className="profile-section">
        <h2 className="section-title">Dietary Restrictions</h2>
        <textarea
          className="textarea"
          rows={4}
          value={dietaryRestrictions}
          onChange={(e) => setDietaryRestrictions(e.target.value)}
          placeholder="E.g., vegetarian, gluten-free, nut allergy..."
        />
      </section>

      {/* Shopping List Section */}
      <section className="profile-section">
        <h2 className="section-title">Shopping List</h2>
        <textarea
          className="textarea"
          rows={4}
          value={shoppingList}
          onChange={(e) => setShoppingList(e.target.value)}
          placeholder="E.g., Milk, Eggs, Bread..."
        />
      </section>

      {/* Save Button */}
      <div className="save-btn-container">
        <button
          onClick={handleSave}
          className="save-btn"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;
