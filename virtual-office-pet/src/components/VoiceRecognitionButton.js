import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './ui/Button';

const VoiceRecognitionButton = ({ isListening, handleListeningToggle }) => {
  return (
    <Button onClick={handleListeningToggle} className={isListening ? 'bg-red-500' : 'bg-blue-500'}>
      {isListening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
    </Button>
  );
};

VoiceRecognitionButton.propTypes = {
  isListening: PropTypes.bool.isRequired,
  handleListeningToggle: PropTypes.func.isRequired
};

export default VoiceRecognitionButton;
