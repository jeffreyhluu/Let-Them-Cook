// App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import UserQuery from './pages/UserQuery';
import NearestGroceryStore from './pages/NearestGroceryStore';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import Login from './pages/Login';

const App = () => {
  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/explore">Explore</Link></li>
          <li><Link to="/user-query">User Query</Link></li>
          <li><Link to="/nearest-grocery-store">Nearest Grocery Store</Link></li>
          <li><Link to="/reviews">Reviews</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/user-query" element={<UserQuery />} />
          <Route path="/nearest-grocery-store" element={<NearestGroceryStore />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
