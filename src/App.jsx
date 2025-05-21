import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import UserQuery from './pages/UserQuery';
import NearestGroceryStore from './pages/NearestGroceryStore';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import Login from './pages/Login';
import TestPage from './pages/TestPage';
import RecipeInstructions from './pages/RecipeInstructions';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Adjust path as needed
import logo from './assets/logo.png';  

import './App.css'; // Assuming you have styles for nav and layout

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("Auth state changed:", currentUser ? "logged in" : "logged out");
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!user ? (
        <Login />  // Show Login page if user is not logged in
      ) : (
        <>
          {/* Navbar */}
          <nav className="navbar">
            <ul className="nav-links">
              <li>
                <Link to="/home">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="logo" 
                  />
                </Link>
              </li>
              <li><Link to="/explore">Explore</Link></li>
              <li><Link to="/user-query">User Query</Link></li>
              <li><Link to="/nearest-grocery-store">Nearest Grocery Store</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li>
                <button className="sign-out-btn" onClick={() => auth.signOut()}>Sign Out</button>
              </li>
            </ul>
          </nav>

          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/user-query" element={<UserQuery />} />
              <Route path="/nearest-grocery-store" element={<NearestGroceryStore />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/recipe/:recipeID" element={<RecipeInstructions />} />
              <Route path="/test-page" element={<TestPage />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </main>
        </>
      )}
    </>
  );
};

export default App;
