import React from 'react';
import { ThemeProvider } from './ThemeContext';
import Home from './Home';
import './styles.css';

function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}

export default App;
