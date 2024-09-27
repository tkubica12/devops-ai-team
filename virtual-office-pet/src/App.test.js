import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

const openMenuAndCheck = (buttonText, expectedText) => {
  const button = screen.getByText(buttonText);
  fireEvent.click(button);
  expect(screen.getByText(expectedText)).toBeInTheDocument();
};

test('handles user interactions correctly', () => {
  render(<VirtualOfficePet />);

  // Customize Interaction
  openMenuAndCheck(/Customize/i, /Customize Your Pet/i);
  
  // Games Feedback
  openMenuAndCheck(/Games/i, 'Games feature coming soon!');

  // Quotes Feedback
  openMenuAndCheck(/Quotes/i, 'Inspirational quotes: Believe in yourself!');
});
