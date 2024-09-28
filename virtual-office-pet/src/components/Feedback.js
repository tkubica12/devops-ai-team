import React from 'react';
import './Feedback.css';

export const Feedback = ({ type, message }) => (
  <div className={`feedback ${type}`}>{message}</div>
);
