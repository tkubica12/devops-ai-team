import React from 'react';
import styles from '../../styles/Button.module.css';

export const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className}`}
    >
      {children}
    </button>
  );
};
