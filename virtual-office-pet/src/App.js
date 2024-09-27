import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import VirtualOfficePetMainCard from './components/VOPComponents';
import ResponsiveNavigation from './components/ResponsiveNavigation';
import CustomizationMenu from './components/CustomizationMenu';
import Feedback from './components/Feedback';
import './App.css';

const VirtualOfficePet = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState('');

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
    <Router>
      <div className="App">
        <Dashboard />
        <VirtualOfficePetMainCard 
          onFeedbackMessage={(message) => setFeedbackMessage(message)}
        />
        {menuOpen && <CustomizationMenu onClose={() => setMenuOpen(false)} />}
        {feedbackMessage && <Feedback message={feedbackMessage} onClose={() => setFeedbackMessage('')} />}
        <ResponsiveNavigation onSelect={handleNavigation} />
      </div>
    </Router>
  );
};

export default VirtualOfficePet;
