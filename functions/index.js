const functions = require("firebase-functions");
const {defineString} = require("firebase-functions/params");
const cors = require("cors")({origin: true});

// Define the API key parameter
const googleMapsApiKey = defineString("GOOGLE_MAPS_API_KEY");

// Google Places API endpoint for nearby grocery stores
exports.nearby = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      console.log("Nearby function called with query:", req.query);
      const {lat, lng} = req.query;

      if (!lat || !lng) {
        console.log("Missing lat/lng parameters");
        return res.status(400).json({
          error: "Latitude and longitude are required",
        });
      }

      const API_KEY = googleMapsApiKey.value();
      console.log("API key available:", !!API_KEY);

      if (!API_KEY) {
        console.log("No API key found");
        return res.status(500).json({
          error: "Google Maps API key not configured",
        });
      }

      const radius = 5000; // 5km radius
      const type = "grocery_or_supermarket";

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${API_KEY}`;
      console.log("Making request to Google Places API");

      const response = await fetch(url);
      console.log("Google API response status:", response.status);

      const data = await response.json();
      console.log("Google API response data:", data);

      if (data.status === "OK" || data.status === "ZERO_RESULTS") {
        res.json(data);
      } else {
        console.log("Google API error:", data.status, data.error_message);
        res.status(400).json({
          error: data.status,
          message: data.error_message,
        });
      }
    } catch (error) {
      console.error("Error fetching nearby stores:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  });
});

// Geocoding endpoint for ZIP code to coordinates
exports.geocode = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const {address} = req.query;

      if (!address) {
        return res.status(400).json({
          error: "Address parameter is required",
        });
      }

      const API_KEY = googleMapsApiKey.value();
      if (!API_KEY) {
        return res.status(500).json({
          error: "Google Maps API key not configured",
        });
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
      const response = await fetch(url);

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error geocoding address:", error);
      res.status(500).json({error: "Internal server error"});
    }
  });
});
