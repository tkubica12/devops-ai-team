import React from 'react';

export const Button = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center py-2 px-4 rounded ${className}`}
  >
    {children}
  </button>
);
