import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const DEFAULT_THEME = 'light';
const ALLOWED_THEMES = ['light', 'dark'];

function sanitizeThemeValue(value) {
  if (!value) return DEFAULT_THEME;
  const cleanValue = DOMPurify.sanitize(value);
  return ALLOWED_THEMES.includes(cleanValue) ? cleanValue : DEFAULT_THEME;
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return sanitizeThemeValue(savedTheme) || systemPreference;
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
