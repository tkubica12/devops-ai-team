import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import logger from './utils/logger';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals((metric) => {
  try {
    logger.log(metric);
  } catch (error) {
    logger.error('Error reporting web vitals:', error);
  }
});
