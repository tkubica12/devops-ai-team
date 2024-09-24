import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV !== 'production') {
  reportWebVitals(console.log);
}
// Ensure secure analytics transmission in a production environment
export const sendPerformanceData = (data) => {
  if (process.env.NODE_ENV === 'production') {
    fetch('https://your-analytics-endpoint.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-secure-token',
      },
      body: JSON.stringify(data),
    });
  }
};