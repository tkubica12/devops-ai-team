import React from 'react';
import { useTheme } from './ThemeContext';
import './styles.css';

const Home = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={isDarkMode ? 'home dark' : 'home light'}>
      <button onClick={toggleTheme}>
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
      <p>Welcome to the Virtual Office Pet app!</p>
    </div>
  );
};

export default Home;
