import React, { useState } from "react";

const UserQuery = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${query}`);
  };

  return (
    <div>
      <h1>User Search Query</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default UserQuery;
