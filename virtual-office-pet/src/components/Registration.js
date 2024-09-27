import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './ui/Button';
import { toast } from 'react-toastify';

const Registration = ({ isRegistered, handleRegister }) => {
  const handleRegistrationClick = () => {
    handleRegister();
    toast.success('Registration successful!');
  };

  return (
    <div className="registration">
      {isRegistered ? (
        <p>You are registered for the competition!</p>
      ) : (
        <Button onClick={handleRegistrationClick} className="mt-4">
          Register for Competition
        </Button>
      )}
    </div>
  );
};

Registration.propTypes = {
  isRegistered: PropTypes.bool.isRequired,
  handleRegister: PropTypes.func.isRequired
};

export default Registration;
