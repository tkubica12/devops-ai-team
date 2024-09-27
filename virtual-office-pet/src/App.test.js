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
  fireEvent.click(screen.getByText(/Customize/i));
  expect(screen.getByText(/Customize Your Pet/i)).toBeInTheDocument();
});

test('should display feedback when games is selected', () => {
  render(<VirtualOfficePet />);
  fireEvent.click(screen.getByText(/Games/i));
  expect(screen.getByText('Games feature coming soon!')).toBeInTheDocument();
});

test('should display feedback when quotes is selected', () => {
  render(<VirtualOfficePet />);
  fireEvent.click(screen.getByText(/Quotes/i));
  expect(screen.getByText('Inspirational quotes: Believe in yourself!')).toBeInTheDocument();
});
