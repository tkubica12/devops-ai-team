import React from 'react';
import PropTypes from 'prop-types';

const VoiceRecognitionErrorHandling = ({ errorMessage }) => {
  return errorMessage ? <div className="error-message text-red-500">{errorMessage}</div> : null;
};

VoiceRecognitionErrorHandling.propTypes = {
  errorMessage: PropTypes.string
};

export default VoiceRecognitionErrorHandling;
