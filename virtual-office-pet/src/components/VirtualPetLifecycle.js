import { useEffect } from 'react';
import PropTypes from 'prop-types';

const VirtualPetLifecycle = ({ pet, onPetDie, checkInterval = 1000 }) => {
  useEffect(() => {
    const checkPetStatus = setInterval(() => {
      if (pet && pet.moodScore <= 0) {
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
  }),
  onPetDie: PropTypes.func.isRequired,
  checkInterval: PropTypes.number,
};

export default VirtualPetLifecycle;
