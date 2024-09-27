import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

const openMenuAndCheck = (buttonText, expectedText) => {
  const button = screen.getByText(buttonText);
  fireEvent.click(button);
  expect(screen.getByText(expectedText)).toBeInTheDocument();
};

test('handles user interactions for customization menu', () => {
  render(<VirtualOfficePet />);

  openMenuAndCheck(/Customize/i, /Customize Your Pet/i);
});

test('displays games feedback message', () => {
  render(<VirtualOfficePet />);

  openMenuAndCheck(/Games/i, 'Games feature coming soon!');
});

test('displays quotes feedback message', () => {
  render(<VirtualOfficePet />);

  openMenuAndCheck(/Quotes/i, 'Inspirational quotes: Believe in yourself!');
});
