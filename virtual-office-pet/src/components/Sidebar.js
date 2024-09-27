import React from 'react';
import { Gamepad, Sliders, Quote } from 'lucide-react';
import Tooltip from '@reach/tooltip';

const Sidebar = ({ onSelect }) => (
  <div className="fixed top-0 left-0 bottom-0 bg-gray-800 text-white w-60 p-4" aria-label="Sidebar">
    <Tooltip label="Games">
      <button onClick={() => onSelect('games')} className="flex items-center mb-4" aria-label="Games">
        <Gamepad size={24} aria-hidden="true" />
        <span className="ml-2">Games</span>
      </button>
    </Tooltip>
    <Tooltip label="Customize">
      <button onClick={() => onSelect('customization')} className="flex items-center mb-4" aria-label="Customize">
        <Sliders size={24} aria-hidden="true" />
        <span className="ml-2">Customize</span>
      </button>
    </Tooltip>
    <Tooltip label="Quotes">
      <button onClick={() => onSelect('quotes')} className="flex items-center" aria-label="Quotes">
        <Quote size={24} aria-hidden="true" />
        <span className="ml-2">Quotes</span>
      </button>
    </Tooltip>
  </div>
);

export default Sidebar;
