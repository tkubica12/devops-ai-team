import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const VirtualPetLifecycle = ({ pet, onPetDie, checkInterval = 1000 }) => {
  const [isAlive, setIsAlive] = useState(true);

  useEffect(() => {
    const checkPetStatus = setInterval(() => {
      if (pet && pet.moodScore <= 0) {
        setIsAlive(false);
        onPetDie();
      }
    }, checkInterval);

    return () => clearInterval(checkPetStatus);
  }, [pet, onPetDie, checkInterval]);

  return null;
};

VirtualPetLifecycle.propTypes = {
  pet: PropTypes.shape({
    type: PropTypes.object.isRequired,
    moodScore: PropTypes.number.isRequired,
  }).isRequired,
  onPetDie: PropTypes.func.isRequired,
  checkInterval: PropTypes.number,
};

export default VirtualPetLifecycle;
