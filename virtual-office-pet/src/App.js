import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import VirtualOfficePetMainCard from './components/VOPComponents';
import ResponsiveNavigation from './components/ResponsiveNavigation';
import CustomizationMenu from './components/CustomizationMenu';
import Feedback from './components/Feedback';
import './App.css';
import { applyAccessibilityFeatures, setAccessibilityPreferences } from './components/Accessibility';

const AppLayout = ({ children }) => (
  <div className="App">
    {children}
  </div>
);

const NavigationHandler = ({ onNavigate }) => (
  <ResponsiveNavigation onSelect={onNavigate} />
);

const FeedbackHandler = ({ message, onClose }) => (
  message && <Feedback message={message} onClose={onClose} />
);

const VirtualOfficePet = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState('');

  React.useEffect(() => {
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
    <Router>
      <AppLayout>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/virtual-office-pet" component={VirtualOfficePetMainCard} />
        </Switch>
        {menuOpen && <CustomizationMenu onClose={() => setMenuOpen(false)} />}
        <FeedbackHandler message={feedbackMessage} onClose={() => setFeedbackMessage('')} />
        <NavigationHandler onNavigate={handleNavigation} />
      </AppLayout>
    </Router>
  );
};

export default VirtualOfficePet;
