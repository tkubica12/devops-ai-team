import React from 'react';
import classNames from 'classnames';

export const Button = ({ children, onClick, className }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={classNames('bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', className)}
  >
    {children}
  </button>
);