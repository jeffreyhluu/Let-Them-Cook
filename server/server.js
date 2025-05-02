require("dotenv").config(); // Load .env vars
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/api/nearby", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat/lng parameters" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=supermarket&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url); // Node 18+ fetch
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Backend fetch error:", err);
    res.status(500).json({ error: "Failed to fetch from Google Places API" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
