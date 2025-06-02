import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ this is new
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // ✅ use createRoot
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
