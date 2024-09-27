import React, { useState } from 'react';

const outfits = [
  { name: 'Winter Coat', category: 'Winter' },
  { name: 'Santa Hat', category: 'Christmas' },
  // ... more outfits
];

const SeasonalOutfits = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredOutfits = outfits.filter(outfit => 
    selectedCategory ? outfit.category === selectedCategory : true
  );

  return (
    <div>
      <h2>Seasonal Outfits</h2>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All</option>
        <option value="Winter">Winter</option>
        <option value="Christmas">Christmas</option>
        {/* Add more categories as needed */}
      </select>
      <div className="outfit-list">
        {filteredOutfits.map(outfit => (
          <div key={outfit.name} className="outfit-item">
            <p>{outfit.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonalOutfits;
