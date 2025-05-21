import React, { useState } from "react";
import { auth, provider } from "../firebase"; // Adjust path as needed
import { signInWithPopup } from "firebase/auth";

// Spinner component (keep if you want the spinner feature)
const Spinner = () => (
  <div style={{
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #4285F4",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    animation: "spin 1s linear infinite",
    margin: "10px auto"
  }}/>
);

// Spinner animation style (needed if using Spinner)
const spinnerStyle = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

if (typeof document !== "undefined" && !document.getElementById("spinner-style")) {
  const style = document.createElement("style");
  style.id = "spinner-style";
  style.innerHTML = spinnerStyle;
  document.head.appendChild(style);
}

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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGoogleLogin();
        }}
      >
        <button
          type="submit"
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
          {loading ? <Spinner /> : "Login with Google"}
        </button>
      </form>
    </div>
  );
};

export default Login;
