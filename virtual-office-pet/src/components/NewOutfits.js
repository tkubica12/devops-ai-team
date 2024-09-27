import React from 'react';
import { Button } from './ui/Button';
import { toast } from 'react-toastify';

const NewOutfits = () => {
  const purchaseOutfit = (type) => {
    toast.success(`Successfully purchased ${type} outfit!`);
  };

  return (
    <div className="new-outfits mt-8">
      <h3 className="text-lg font-bold">New Seasonal Outfits</h3>
      <p className="text-sm text-gray-500">Get ready for the season with these themed outfits.</p>
      <div className="flex flex-wrap gap-4 mt-4">
        <Button className="mt-2" onClick={() => purchaseOutfit('Halloween')}>Halloween</Button>
        <Button className="mt-2" onClick={() => purchaseOutfit('Christmas')}>Christmas</Button>
        <Button className="mt-2" onClick={() => purchaseOutfit('Summer')}>Summer</Button>
      </div>
    </div>
  );
};

export default NewOutfits;
