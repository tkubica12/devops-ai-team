import PropTypes from 'prop-types';

const VirtualPetLifecycle = ({ pet, onPetDie, checkInterval = 1000 }) => {
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
