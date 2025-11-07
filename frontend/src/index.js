import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css'; // ← Ajoutez cette ligne

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);