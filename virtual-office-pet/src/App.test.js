import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

const openMenuAndCheck = (buttonText, expectedText) => {
  const button = screen.getByText(buttonText);
  fireEvent.click(button);
  expect(screen.getByText(expectedText)).toBeInTheDocument();
};

test('should display customization menu correctly', () => {
  render(<VirtualOfficePet />);
  openMenuAndCheck(/Customize/i, /Customize Your Pet/i);
});

test('should display feedback when games is selected', () => {
  render(<VirtualOfficePet />);
  openMenuAndCheck(/Games/i, 'Games feature coming soon!');
});

test('should display feedback when quotes is selected', () => {
  render(<VirtualOfficePet />);
  openMenuAndCheck(/Quotes/i, 'Inspirational quotes: Believe in yourself!');
});
