import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { Sun, Moon } from 'lucide-react';

const DEFAULT_THEME = 'light';
const ALLOWED_THEMES = ['light', 'dark'];

function sanitizeThemeValue(value) {
  if (!value) return DEFAULT_THEME;
  const cleanValue = DOMPurify.sanitize(value);
  return ALLOWED_THEMES.includes(cleanValue) ? cleanValue : DEFAULT_THEME;
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = sanitizeThemeValue(localStorage.getItem('theme'));
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return ALLOWED_THEMES.includes(storedTheme) ? storedTheme : systemPreference;
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
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button onClick={toggleTheme} className="dark-mode-toggle">
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
};

ThemeToggle.propTypes = {
  initialTheme: PropTypes.string,
};

export default ThemeToggle;
