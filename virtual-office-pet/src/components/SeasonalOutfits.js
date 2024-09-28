import React from 'react';

const outfitPacks = [
  { name: 'Winter Wonderland', price: 5 },
  { name: 'Summer Vibes', price: 5 },
  { name: 'Spring Bloom', price: 5 },
  { name: 'Autumn Chill', price: 5 },
];

export const SeasonalOutfits = ({ onPurchase }) => {
  return (
    <div className="outfits-container">
      <h2>Seasonal Outfit Packs</h2>
      <ul>
        {outfitPacks.map(pack => (
          <li key={pack.name} className="outfit-pack">
            <span>{pack.name} - ${pack.price}</span>
            <button onClick={() => onPurchase(pack)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
