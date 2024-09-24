import React, { useState, useEffect } from 'react';

const sanitizeTheme = (theme) => {
  return theme === 'light' || theme === 'dark' ? theme : 'light';
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return sanitizeTheme(storedTheme) || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!localStorage.getItem('theme')) {
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white font-bold py-2 px-4 rounded">
      Toggle Theme
    </button>
  );
};

export default ThemeToggle;
