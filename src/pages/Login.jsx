import React, { useState } from "react";
import { auth, provider } from "../firebase"; // Adjust path as needed
import { signInWithPopup } from "firebase/auth";


const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    console.log("Login button clicked"); // Debug log
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Login successful:", result.user.displayName);
      // No redirect needed here - App.jsx will handle it
    } catch (error) {
      console.error("Login error:", error);
      setError(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Welcome to Let Them Cook</h1>
      <p>Please login to continue</p>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "default" : "pointer"
        }}
      >
        {loading ? "Logging in..." : "Login with Google"}
      </button>
    </div>
  );
};

export default Login;