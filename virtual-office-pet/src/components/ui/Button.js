import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};