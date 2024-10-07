import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message }) => (
  <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg" role="alert">
    {message}
  </div>
);

Notification.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Notification;
