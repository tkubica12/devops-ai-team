import React from 'react';
import { Button } from './ui/Button';
import { toast } from 'react-toastify';

const Monetization = () => {
  const buyPremiumVoicePack = () => {
    toast.success('Premium voice pack purchased successfully!');
  };

  const subscribeToAdvancedFeatures = () => {
    toast.success('Subscribed to advanced voice features!');
  };

  return (
    <div className="monetization mt-8">
      <h3 className="text-lg font-bold">Monetization Options</h3>
      <p className="mt-2">Explore our voice command features with premium packs and subscriptions:</p>
      <Button className="mt-4" onClick={buyPremiumVoicePack}>
        Buy Premium Voice Pack
      </Button>
      <Button className="mt-4" onClick={subscribeToAdvancedFeatures}>
        Subscribe to Advanced Features
      </Button>
    </div>
  );
};

export default Monetization;
