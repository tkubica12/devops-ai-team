import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validate } from 'validate.js';

const DEFAULT_THEME = 'light';
const ALLOWED_THEMES = ['light', 'dark'];

const themeConstraints = {
  theme: {
    inclusion: ALLOWED_THEMES,
  }
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return !validate({theme: savedTheme}, themeConstraints) ? savedTheme : DEFAULT_THEME;
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button onClick={toggleTheme} className="dark-mode-toggle">
      {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
};

ThemeToggle.propTypes = {
  initialTheme: PropTypes.string,
};

export default ThemeToggle;
