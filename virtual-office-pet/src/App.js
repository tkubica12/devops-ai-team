import React, { useState, useEffect } from 'react';
import { VirtualOfficePetMainCard } from './components/VOPComponents';
import './App.css';
import Sidebar from './components/Sidebar';
import Feedback from './components/Feedback';
import Dashboard from './components/Dashboard';
import { applyAccessibilityFeatures } from './components/Accessibility';

const CustomizationMenu = ({ onClose }) => (
  <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded-lg">
      <h2>Customize Your Pet</h2>
      <button onClick={onClose} className="mt-2 bg-red-500 text-white rounded px-4 py-2">Close</button>
    </div>
  </div>
);

const VirtualOfficePet = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    applyAccessibilityFeatures();
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
      <Sidebar onSelect={handleNavigation} />
    </div>
  );
};

export default VirtualOfficePet;
