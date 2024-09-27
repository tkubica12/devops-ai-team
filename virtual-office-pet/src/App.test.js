import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

test('should open customization menu when customize button is clicked', () => {
  render(<VirtualOfficePet />);
  const customizeButton = screen.getByText(/Customize/i);
  fireEvent.click(customizeButton);
  expect(screen.getByText(/Customize Your Pet/i)).toBeInTheDocument();
});

test('should set feedback message when games feature is selected', () => {
  render(<VirtualOfficePet />);
  const gamesButton = screen.getByText(/Games/i);
  fireEvent.click(gamesButton);
  expect(screen.getByText('Games feature coming soon!')).toBeInTheDocument();
});

test('should display quote feedback on selecting quotes', () => {
  render(<VirtualOfficePet />);
  const quotesButton = screen.getByText(/Quotes/i);
  fireEvent.click(quotesButton);
  expect(screen.getByText('Inspirational quotes: Believe in yourself!')).toBeInTheDocument();
});
