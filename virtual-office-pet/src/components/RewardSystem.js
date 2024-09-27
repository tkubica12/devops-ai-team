import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './ui/Button';

tarimport { toast } from 'react-toastify';

const RewardSystem = ({ handleReward }) => {
  const handleRewardClick = () => {
    handleReward();
    toast.success('Reward claimed!');
  };

  return (
    <div className="reward-system mt-8">
      <h4 className="font-semibold">Rewards System</h4>
      <Button onClick={handleRewardClick} className="mt-4">
        Claim Reward
      </Button>
    </div>
  );
};

RewardSystem.propTypes = {
  handleReward: PropTypes.func.isRequired
};

export default RewardSystem;
