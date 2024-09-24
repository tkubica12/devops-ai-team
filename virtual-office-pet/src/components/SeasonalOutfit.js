import React, { useState } from 'react';

const outfits = {
  summer: ['T-shirt', 'Shorts', 'Sandals'],
  winter: ['Jacket', 'Jeans', 'Boots'],
};

const SeasonalOutfit = () => {
  const [selectedSeason, setSelectedSeason] = useState('summer');

  return (
    <div className="outfit-selector">
      <h2>Select Outfit by Season</h2>
      <div className="season-buttons">
        <button onClick={() => setSelectedSeason('summer')}>Summer</button>
        <button onClick={() => setSelectedSeason('winter')}>Winter</button>
      </div>
      <div className="selected-outfit">
        <h3>{selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)} Outfit</h3>
        <ul>
          {outfits[selectedSeason].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SeasonalOutfit;
