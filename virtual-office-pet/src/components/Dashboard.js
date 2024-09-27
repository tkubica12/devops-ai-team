import React from 'react';
import { FaGamepad, FaPaintBrush, FaQuoteRight } from 'react-icons/fa';

const Dashboard = () => (
  <div className="flex justify-around p-4 bg-gray-200">
    <div className="text-center">
      <FaGamepad size={24} />
      <p>Games</p>
    </div>
    <div className="text-center">
      <FaPaintBrush size={24} />
      <p>Customize</p>
    </div>
    <div className="text-center">
      <FaQuoteRight size={24} />
      <p>Quotes</p>
    </div>
  </div>
);

export default Dashboard;
