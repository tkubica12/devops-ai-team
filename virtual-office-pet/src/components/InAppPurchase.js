import React from 'react';
import { Button } from './ui/Button';

const customizationOptions = [
  { id: 1, name: 'Super Dog Pack', price: '$2.99' },
  { id: 2, name: 'Cat Charm Pack', price: '$2.99' },
  { id: 3, name: 'Pet Personality Upgrade', price: '$4.99' }
];

const InAppPurchase = ({ onPurchase }) => {
  return (
    <div className="purchase-container">
      <h2 className="text-lg font-bold mb-4">In-App Purchases</h2>
      {customizationOptions.map(option => (
        <div key={option.id} className="purchase-item">
          <span>{option.name} - {option.price}</span>
          <Button onClick={() => onPurchase(option)}>Buy</Button>
        </div>
      ))}
    </div>
  );
};

export default InAppPurchase;
