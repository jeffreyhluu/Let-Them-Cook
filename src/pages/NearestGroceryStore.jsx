import React, { useEffect, useState } from "react";
import "./css/input.css";

const NearestGroceryStore = ({ missingIngredients }) => {
  const [locationAllowed, setLocationAllowed] = useState(null);
  const [zipCode, setZipCode] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zipError, setZipError] = useState("");

  // Extract just the ingredient names for table headers
  console.log("Missing ingredients:", missingIngredients);
  const ingredientNames = missingIngredients?.map(item => item.ingredient) || [];

  useEffect(() => {
    const confirmed = window.confirm(
      "Do you want to share your location to find nearby grocery stores?"
    );
    if (confirmed) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationAllowed(true);
          const { latitude, longitude } = position.coords;
          console.log("User location obtained:", latitude, longitude);
          fetchStores({ lat: latitude, lng: longitude });
        },
        () => {
          setLocationAllowed(false);
          console.log("User denied location access or error occurred.");
        }
      );
    } else {
      setLocationAllowed(false);
      console.log("User declined location sharing.");
    }
  }, []);

  const fetchStores = async (location) => {
    setLoading(true);
    try {
      console.log("Fetching stores near:", location);
      const response = await fetch(
        `http://localhost:4000/api/nearby?lat=${location.lat}&lng=${location.lng}`
      );
      const data = await response.json();
      console.log("Stores fetch response data:", data);
      const fetchedStores = data.results || [];
      setStores(fetchedStores);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setStores([]);
    }
    setLoading(false);
  };

  const handleZipSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zipCode)) {
      setZipError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    setZipError("");
    setLoading(true);
    try {
      console.log("Fetching geocode for ZIP code:", zipCode);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      console.log("Geocode response data:", data);
      if (data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        console.log("Location from ZIP code:", location);
        fetchStores(location);
      } else {
        console.warn("No location results found for ZIP code:", zipCode);
        setStores([]);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching location:", err);
      setStores([]);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Nearest Grocery Stores</h1>
      {loading && <p className="loading">Loading...</p>}

      {!locationAllowed && (
        <form onSubmit={handleZipSubmit}>
          <label>
            Enter your ZIP code:
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g., 98105"
              required
            />
          </label>
          {zipError && <p style={{ color: "red" }}>{zipError}</p>}
          <button type="submit">Find Stores</button>
        </form>
      )}

      {stores.length > 0 && (
        <div className="table-container">
          <table className="stores-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Address</th>
                <th>Rating</th>
                {ingredientNames.map((ingredient) => (
                  <th key={ingredient}>{ingredient} Price</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stores.map((store, index) => (
                <tr key={store.place_id || index}>
                  <td>{store.name}</td>
                  <td>{store.vicinity}</td>
                  <td>{store.rating ? store.rating : "N/A"}</td>
                  {missingIngredients.map(({ ingredient, price, unit }) => (
                    <td key={ingredient}>
                      {price !== null && price !== undefined
                        ? `$${price} / ${unit || "unit"}`
                        : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && stores.length === 0 && locationAllowed !== null && (
        <p>No grocery stores found for this location.</p>
      )}
    </div>
  );
};

export default NearestGroceryStore;
