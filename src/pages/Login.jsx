import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import logo from "../assets/logo.png"; // Import your logo image
import "./css/login.css";  // Import the login-specific CSS

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Login successful:", result.user.displayName);
    } catch (error) {
      console.error("Login error:", error);
      setError(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-page-gradient">
      {/* Logo at the top left */}
      <img src={logo} alt="Let Them Cook Logo" className="logo" />

      <div className="login-card">
        <h1>Welcome to Let Them Cook</h1>
        <p>Please sign in for access to Yummerz, Recipes, and more!</p>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="button"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google icon"
            className="w-5 h-5"
          />
          {loading ? "Logging in..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
