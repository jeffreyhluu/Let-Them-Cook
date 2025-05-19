import React, { useState } from "react";
import { collection, query as firestoreQuery, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const UserQuery = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const recipesRef = collection(db, "RecipesCollection");
      const q = firestoreQuery(
        recipesRef,
        where("recipeName", ">=", query),
        where("recipeName", "<=", query + "\uf8ff")
      );
      const snapshot = await getDocs(q);
      const found = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setResults(found);

      // Update history (no duplicates, max 5)
      setHistory((prev) => {
        const updated = [query, ...prev.filter((q) => q !== query)];
        return updated.slice(0, 5);
      });
    } catch (err) {
      console.error("Error searching:", err);
    }
    setLoading(false);
    setQuery("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  const handleHistoryClick = (q) => {
    setQuery(q);
    handleSearch();
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Search Recipes</h1>

      <div className="flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter recipe name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </div>

      {/* Search History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-md font-semibold text-gray-700">Recent Searches</h2>
          <ul className="list-disc pl-5">
            {history.map((item, idx) => (
              <li
                key={idx}
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleHistoryClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search Results */}
      <div>
        {loading ? (
          <p>Loading results...</p>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-md font-semibold text-gray-700">Results</h2>
            {results.map((recipe) => (
              <div key={recipe.id} className="p-3 border rounded-md shadow-sm bg-gray-50">
                <h3 className="font-bold">{recipe.recipeName}</h3>
                <p className="text-sm text-gray-600">
                  Cuisine: {recipe.cuisineType} | Difficulty: {recipe.difficulty}
                </p>
              </div>
            ))}
          </div>
        ) : (
          query === "" ? null : <p className="text-gray-500">No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default UserQuery;