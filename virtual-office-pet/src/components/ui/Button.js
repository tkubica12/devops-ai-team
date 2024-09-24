import React from 'react';

// Button component used for interactive elements like pet actions
// Uses semantic and descriptive class names to enhance readability
export const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded ${className}`}
  >
    {children}
  </button>
);