import React from 'react';
import { FaGamepad, FaPaintBrush, FaQuoteRight } from 'react-icons/fa';

const Dashboard = () => (
  <div className="flex justify-around p-4 bg-gray-200" aria-label="Dashboard">
    <div className="text-center" aria-label="Games">
      <FaGamepad size={24} />
      <p>Games</p>
    </div>
    <div className="text-center" aria-label="Customize">
      <FaPaintBrush size={24} />
      <p>Customize</p>
    </div>
    <div className="text-center" aria-label="Quotes">
      <FaQuoteRight size={24} />
      <p>Quotes</p>
    </div>
  </div>
);

export default Dashboard;
