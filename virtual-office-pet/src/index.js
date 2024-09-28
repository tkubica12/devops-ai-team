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
    name: DOMPurify.sanitize(metric.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    value: DOMPurify.sanitize(metric.value.toString(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
  };

  console.log(sanitizedMetric.name, sanitizedMetric.value);
});
