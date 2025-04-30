// src/pages/Home.jsx
import React from 'react';
import Chatbot from '../Components/Chatbot';

const Home = () => {
  return (
    <div>
      <h1>🍓 Welcome to Let Them Cook!</h1>
      <p>
        Explore flavors as fresh as fruit. Search for groceries, read reviews, and find your next
        favorite meal adventure. 🍍🥝🍇
      </p>
      <Chatbot />
    </div>
  );
};

export default Home;
