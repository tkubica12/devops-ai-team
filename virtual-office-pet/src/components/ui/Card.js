import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Card = ({ children, className }) => {
  const { theme } = useTheme();
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-xl font-bold">{children}</h2>;
export const CardContent = ({ children }) => <div>{children}</div>;