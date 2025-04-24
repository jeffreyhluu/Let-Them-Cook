import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <Link to="/" className="header-button">Home</Link>
      <Link to="/explore" className="header-button">Explore</Link>
      <Link to="/user-query" className="header-button">Search</Link>
      <Link to="/nearest-grocery-store" className="header-button">Nearest Grocery</Link>
      <Link to="/reviews" className="header-button">Reviews</Link>
      <Link to="/profile" className="header-button">Profile</Link>
      <Link to="/login" className="header-button">Login</Link>
    </div>
  );
};

export default Header;
