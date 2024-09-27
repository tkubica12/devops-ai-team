import React from 'react';
import { FaGamepad, FaPaintBrush, FaQuoteRight, FaCog } from 'react-icons/fa';
import { Tooltip } from '@reach/tooltip';

const BottomNav = ({ onSelect }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around p-2 z-10" aria-label="Bottom Navigation">
    <Tooltip label="Games">
      <button onClick={() => onSelect('games')} className="flex flex-col items-center" aria-label="Games" tabIndex="0">
        <FaGamepad size={24} aria-hidden="true" />
        <span>Games</span>
      </button>
    </Tooltip>
    <Tooltip label="Customize">
      <button onClick={() => onSelect('customization')} className="flex flex-col items-center" aria-label="Customize" tabIndex="0">
        <FaPaintBrush size={24} aria-hidden="true" />
        <span>Customize</span>
      </button>
    </Tooltip>
    <Tooltip label="Quotes">
      <button onClick={() => onSelect('quotes')} className="flex flex-col items-center" aria-label="Quotes" tabIndex="0">
        <FaQuoteRight size={24} aria-hidden="true" />
        <span>Quotes</span>
      </button>
    </Tooltip>
    <Tooltip label="Settings">
      <button onClick={() => onSelect('settings')} className="flex flex-col items-center" aria-label="Settings" tabIndex="0">
        <FaCog size={24} aria-hidden="true" />
        <span>Settings</span>
      </button>
    </Tooltip>
  </div>
);

export default BottomNav;
