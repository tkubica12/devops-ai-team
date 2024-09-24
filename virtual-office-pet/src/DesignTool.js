import React, { useState } from 'react';

const DesignTool = ({ setOutfit }) => {
  const [color, setColor] = useState('#ff0000');
  const [pattern, setPattern] = useState('stripes');

  const patterns = ['stripes', 'dots', 'plain'];

  const handleSubmit = () => {
    const customOutfit = `${pattern} pattern in ${color}`;
    setOutfit(customOutfit);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Design Your Own Outfit</h3>
      <div>
        <label className="block mb-1">Choose Color:</label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          className="mb-4"
        />
        <label className="block mb-1">Pattern:</label>
        <select onChange={(e) => setPattern(e.target.value)} value={pattern} className="mb-4">
          {patterns.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button 
          onClick={handleSubmit} 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
        >
          Save Design
        </button>
      </div>
    </div>
  );
};

export default DesignTool;