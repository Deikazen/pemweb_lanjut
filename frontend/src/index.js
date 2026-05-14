// ============================================
// index.js  (Entry Point)
// → Titik masuk aplikasi React
// → Import global styles lalu render App
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';   // CSS variables, reset, typography
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
