import React from 'react';
import DOMPurify from 'dompurify';

export const Button = ({ children, onClick, className }) => {
  const sanitizedLabel = DOMPurify.sanitize(children);

  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
      style={{ padding: '10px 20px', borderRadius: '5px' }}
    >
      {sanitizedLabel}
    </button>
  );
};
