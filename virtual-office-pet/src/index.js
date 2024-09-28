import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import DOMPurify from 'dompurify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals((metric) => {
  const sanitizedMetric = {
    name: DOMPurify.sanitize(metric.name),
    value: DOMPurify.sanitize(metric.value.toString()),
  };

  console.log(sanitizedMetric.name, sanitizedMetric.value); // Example of sanitized output
});
