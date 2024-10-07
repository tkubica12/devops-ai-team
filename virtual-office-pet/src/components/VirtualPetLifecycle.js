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

  if (!isAlive) {
    return (
      <div className="w-full p-4 text-center bg-red-100 border border-red-400 text-red-700 rounded">
        Your pet has passed away. You can remember your pet with memorabilia or start a new life.
      </div>
    );
  }

  return null;
};

VirtualPetLifecycle.propTypes = {
  pet: PropTypes.object.isRequired,
  onPetDie: PropTypes.func.isRequired,
};

export default VirtualPetLifecycle;
