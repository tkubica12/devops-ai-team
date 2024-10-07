import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const VirtualPetLifecycle = ({ pet, onPetDie }) => {
  const [isAlive, setIsAlive] = useState(true);

  useEffect(() => {
    const checkPetStatus = setInterval(() => {
      if (pet && pet.moodScore <= 0) {
        setIsAlive(false);
        onPetDie();
      }
    }, 1000);

    return () => clearInterval(checkPetStatus);
  }, [pet, onPetDie]);

  return null;
};

VirtualPetLifecycle.propTypes = {
  pet: PropTypes.object.isRequired,
  onPetDie: PropTypes.func.isRequired,
};

export default VirtualPetLifecycle;
