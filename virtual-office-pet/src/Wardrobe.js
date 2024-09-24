import React, { useState } from 'react';

const Wardrobe = ({ outfit, setOutfit }) => {
  const outfits = [
    { name: 'Summer Dress', season: 'Summer', occasion: 'Casual' },
    { name: 'Winter Coat', season: 'Winter', occasion: 'Formal' },
    { name: 'Halloween Costume', season: 'Fall', occasion: 'Halloween' }
  ];

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Choose an Outfit</h3>
      <div className="grid grid-cols-1 gap-2">
        {outfits.map((outfit) => (
          <button
            key={outfit.name}
            className="border rounded p-2 hover:bg-gray-200" 
            onClick={() => setOutfit(outfit.name)}
          >
            {outfit.name}
          </button>
        ))}
      </div>
      {outfit && <p className="mt-2">Selected Outfit: {outfit}</p>}
    </div>
  );
};

export default Wardrobe;