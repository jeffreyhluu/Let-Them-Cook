import React, { useEffect, useState } from "react";

const NearestGroceryStore = () => {
  const [locationAllowed, setLocationAllowed] = useState(null);
  const [zipCode, setZipCode] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const confirmed = window.confirm(
      "Do you want to share your location to find nearby grocery stores?"
    );
    if (confirmed) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationAllowed(true);
          const { latitude, longitude } = position.coords;
          fetchStores({ lat: latitude, lng: longitude });
        },
        () => {
          setLocationAllowed(false);
        }
      );
    } else {
      setLocationAllowed(false);
    }
  }, []);

  const fetchStores = async (location) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/nearby?lat=${location.lat}&lng=${location.lng}`
      );
      const data = await response.json();
      console.log(data)
      setStores(data.results || []);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setStores([]);
    }
    setLoading(false);
  };


  const handleZipSubmit = async (e) => {
    e.preventDefault();
    if (zipCode.trim() !== "") {
      setLoading(true);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results[0]) {
          const location = data.results[0].geometry.location;
          fetchStores(location);
        } else {
          setStores([]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        setStores([]);
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Nearest Grocery Stores</h1>
      {loading && <p>Loading stores...</p>}

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
          <button type="submit">Find Stores</button>
        </form>
      )}

      {stores.length > 0 && (
        <ul>
        {stores.map((store, index) => (
          <li key={index}>
            <strong>{store.name}</strong> <br />
            {store.vicinity}
          </li>
        ))}
        </ul>
      )}
    </div>
  );
};

export default NearestGroceryStore;
