// App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import UserQuery from './pages/UserQuery';
import NearestGroceryStore from './pages/NearestGroceryStore';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Adjust path as needed

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
      {user && (
        <nav>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/user-query">User Query</Link></li>
            <li><Link to="/nearest-grocery-store">Nearest Grocery Store</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={() => auth.signOut()}>Sign Out</button></li>
          </ul>
        </nav>
      )}

      <main>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/home" /> : <Login />} 
          />
          <Route 
            path="/home" 
            element={user ? <Home /> : <Navigate to="/" />} 
          />
          <Route 
            path="/explore" 
            element={user ? <Explore /> : <Navigate to="/" />} 
          />
          <Route 
            path="/user-query" 
            element={user ? <UserQuery /> : <Navigate to="/" />} 
          />
          <Route 
            path="/nearest-grocery-store" 
            element={user ? <NearestGroceryStore /> : <Navigate to="/" />} 
          />
          <Route 
            path="/reviews" 
            element={user ? <Reviews /> : <Navigate to="/" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
};

export default App;