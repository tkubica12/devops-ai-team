import React from 'react';
import { FaGamepad, FaPaintBrush, FaQuoteRight, FaCog } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Games from './Games';
import Customization from './Customization';
import Quotes from './Quotes';
import Settings from './Settings';

const Dashboard = () => (
  <Router>
    <div className="flex flex-col md:flex-row bg-gray-200 min-h-screen">
      <div className="md:w-1/4 p-4 bg-gray-800 text-white">
        <h2 className="text-xl mb-4">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/games" className="flex items-center" aria-label="Games">
                <FaGamepad size={20} className="mr-2" />
                Games
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/customization" className="flex items-center" aria-label="Customization">
                <FaPaintBrush size={20} className="mr-2" />
                Customization
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/quotes" className="flex items-center" aria-label="Quotes">
                <FaQuoteRight size={20} className="mr-2" />
                Quotes
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center" aria-label="Settings">
                <FaCog size={20} className="mr-2" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="md:w-3/4 p-4">
        <Switch>
          <Route path="/games" component={Games} />
          <Route path="/customization" component={Customization} />
          <Route path="/quotes" component={Quotes} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default Dashboard;
