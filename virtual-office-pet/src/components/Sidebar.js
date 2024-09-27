import React from 'react';
import { Gamepad, Sliders, Quote } from 'lucide-react';

const Sidebar = ({ onSelect }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around p-2" aria-label="Sidebar">
    <button onClick={() => onSelect('games')} className="flex flex-col items-center" aria-label="Games">
      <Gamepad size={24} />
      <span>Games</span>
    </button>
    <button onClick={() => onSelect('customization')} className="flex flex-col items-center" aria-label="Customize">
      <Sliders size={24} />
      <span>Customize</span>
    </button>
    <button onClick={() => onSelect('quotes')} className="flex flex-col items-center" aria-label="Quotes">
      <Quote size={24} />
      <span>Quotes</span>
    </button>
  </div>
);

export default Sidebar;
