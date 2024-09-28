import { useState } from 'react';

export const useSeasonalOutfits = () => {
  const [ownedOutfits, setOwnedOutfits] = useState([]);

  const purchaseOutfitPack = (pack) => {
    setOwnedOutfits([...ownedOutfits, pack]);
    // Additional logic for handling in-app purchase can be added here
  };

  return { ownedOutfits, purchaseOutfitPack };
};
