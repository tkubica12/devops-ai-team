import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Button = ({ children, onClick, className }) => {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      className={`$ {
        theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-blue-500 hover:bg-blue-700'
      } text-white font-bold py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
};