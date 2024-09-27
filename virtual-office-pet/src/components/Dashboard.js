import React from 'react';
import { FaGamepad, FaPaintBrush, FaQuoteRight } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Games from './Games';
import Customization from './Customization';
import Quotes from './Quotes';
import Settings from './Settings';

const Dashboard = () => (
  <Router>
    <div className="flex justify-around p-4 bg-gray-200" aria-label="Dashboard">
      <Link to="/games" className="text-center" aria-label="Games">
        <FaGamepad size={24} />
        <p>Games</p>
      </Link>
      <Link to="/customization" className="text-center" aria-label="Customize">
        <FaPaintBrush size={24} />
        <p>Customize</p>
      </Link>
      <Link to="/quotes" className="text-center" aria-label="Quotes">
        <FaQuoteRight size={24} />
        <p>Quotes</p>
      </Link>
      <Link to="/settings" className="text-center" aria-label="Settings">
        <FaPaintBrush size={24} />
        <p>Settings</p>
      </Link>
    </div>
    <Switch>
      <Route path="/games" component={Games} />
      <Route path="/customization" component={Customization} />
      <Route path="/quotes" component={Quotes} />
      <Route path="/settings" component={Settings} />
    </Switch>
  </Router>
);

export default Dashboard;
