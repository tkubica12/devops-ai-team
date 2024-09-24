import React from 'react';
import { Button } from './ui/Button';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} className="ml-auto">
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </Button>
  );
};

export default ThemeToggle;