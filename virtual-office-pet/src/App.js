import React, { useState, useEffect } from 'react';
import { VirtualOfficePetMainCard } from './components/VOPComponents';
import './App.css';
import Sidebar from './components/Sidebar';
import CustomizationMenu from './components/CustomizationMenu';
import Feedback from './components/Feedback';
import Dashboard from './components/Dashboard';

const VirtualOfficePet = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleNavigation = (section) => {
    if (section === 'customization') {
      setMenuOpen(true);
    } else if (section === 'games') {
      setFeedbackMessage('Games feature coming soon!');
    } else if (section === 'quotes') {
      setFeedbackMessage('Inspirational quotes: Believe in yourself!');
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
