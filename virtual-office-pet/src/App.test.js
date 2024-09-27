import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

// Test if customization menu opens
test('opens customization menu when Customize is selected', () => {
  render(<VirtualOfficePet />);
  const customizeButton = screen.getByText(/Customize/i);
  fireEvent.click(customizeButton);
  expect(screen.getByText(/Customize Your Pet/i)).toBeInTheDocument();
});

// Test if feedback message appears for games
test('displays feedback message when Games is selected', () => {
  render(<VirtualOfficePet />);
  const gamesButton = screen.getByText(/Games/i);
  fireEvent.click(gamesButton);
  expect(screen.getByText('Games feature coming soon!')).toBeInTheDocument();
});

// Test if quote feedback is displayed
test('displays quote feedback when Quotes is selected', () => {
  render(<VirtualOfficePet />);
  const quotesButton = screen.getByText(/Quotes/i);
  fireEvent.click(quotesButton);
  expect(screen.getByText('Inspirational quotes: Believe in yourself!')).toBeInTheDocument();
});

// Test if feedback closes after delay
test('feedback message is removed after delay', () => {
  jest.useFakeTimers();
  render(<VirtualOfficePet />);
  const quotesButton = screen.getByText(/Quotes/i);
  fireEvent.click(quotesButton);
  expect(screen.getByText('Inspirational quotes: Believe in yourself!')).toBeInTheDocument();
  jest.runAllTimers();
  expect(screen.queryByText('Inspirational quotes: Believe in yourself!')).not.toBeInTheDocument();
  jest.useRealTimers();
});
