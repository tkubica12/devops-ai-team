import React, { useState, useEffect } from 'react';
import { fetchOutfits } from './api/outfitService';

const Wardrobe = () => {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const data = await fetchOutfits();
        setOutfits(data);
      } catch (err) {
        setError('Failed to load outfits. Please try again later.');
      }
    };

    loadOutfits();
  }, []);

  return (
    <div>
      {error ? <p className="text-red-500">{error}</p> : (
        <ul>
          {outfits.map((outfit) => (
            <li key={outfit.id}>{outfit.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wardrobe;