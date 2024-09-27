import React, { useState, useEffect } from 'react';
import { VirtualOfficePetMainCard } from './components/VOPComponents';
import './App.css';
import ResponsiveNavigation from './components/ResponsiveNavigation';
import Feedback from './components/Feedback';
import Dashboard from './components/Dashboard';
import { applyAccessibilityFeatures } from './components/Accessibility';
import { setAccessibilityPreferences } from './components/Accessibility';

const VirtualOfficePet = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    applyAccessibilityFeatures();
    setAccessibilityPreferences();
  }, []);

  const handleNavigation = (section) => {
    switch (section) {
      case 'customization':
        setMenuOpen(true);
        break;
      case 'games':
        setFeedbackMessage('Games feature coming soon!');
        break;
      case 'quotes':
        setFeedbackMessage('Inspirational quotes: Believe in yourself!');
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <Dashboard />
      <VirtualOfficePetMainCard 
        onFeedbackMessage={(message) => setFeedbackMessage(message)}
      />
      {menuOpen && <CustomizationMenu onClose={() => setMenuOpen(false)} />}
      {feedbackMessage && <Feedback message={feedbackMessage} onClose={() => setFeedbackMessage('')} />}
      <ResponsiveNavigation onSelect={handleNavigation} />
    </div>
  );
};

export default VirtualOfficePet;
