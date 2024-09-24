import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-xl font-bold">{children}</h2>;
export const CardContent = ({ children }) => <div>{children}</div>;

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};