import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optionally remove console.log from reportWebVitals
import { reportWebVitals } from './reportWebVitals';
// reportWebVitals(console.log);
reportWebVitals();
