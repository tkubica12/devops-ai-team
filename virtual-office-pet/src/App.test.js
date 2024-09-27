import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

test('opens customization menu when Customize is selected', () => {
  render(<VirtualOfficePet />);
  const customizeButton = screen.getByText(/Customize/i);
  fireEvent.click(customizeButton);
  expect(screen.getByText(/Customize Your Pet/i)).toBeInTheDocument();
});

test('sets feedback message when Games is selected', () => {
  render(<VirtualOfficePet />);
  const gamesButton = screen.getByText(/Games/i);
  fireEvent.click(gamesButton);
  expect(screen.getByText('Games feature coming soon!')).toBeInTheDocument();
});

test('displays quote feedback on selecting Quotes', () => {
  render(<VirtualOfficePet />);
  const quotesButton = screen.getByText(/Quotes/i);
  fireEvent.click(quotesButton);
  expect(screen.getByText('Inspirational quotes: Believe in yourself!')).toBeInTheDocument();
});
