import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Helmet from 'react-helmet';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Helmet>
      <title>Virtual Office Pet</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Add security headers */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src * 'self' data:; child-src 'none';" />
    </Helmet>
    <App />
  </React.StrictMode>
);

reportWebVitals((metric) => {
  if (process.env.NODE_ENV === 'production') {
    fetch('https://your-secure-endpoint.com/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        delta: metric.delta,
        id: metric.id,
        // More fields with sanitized data
      }),
    });
  }
});
