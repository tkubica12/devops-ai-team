import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

// Test if customization menu opens
// This test checks that the Customization Menu should appear when the Customize button is clicked.
test('opens customization menu when Customize is selected', () => {
  render(<VirtualOfficePet />);
  const customizeButton = screen.getByText(/Customize/i);
  fireEvent.click(customizeButton);
  expect(screen.getByText(/Customize Your Pet/i)).toBeInTheDocument();
});

// Test if feedback message appears for games
// This test checks that a feedback message is displayed when the Games button is clicked.
test('displays feedback message when Games is selected', () => {
  render(<VirtualOfficePet />);
  const gamesButton = screen.getByText(/Games/i);
  fireEvent.click(gamesButton);
  expect(screen.getByText('Games feature coming soon!')).toBeInTheDocument();
});

// Test if quote feedback is displayed
// This test checks that a quote feedback message is shown when the Quotes button is clicked.
test('displays quote feedback when Quotes is selected', () => {
  render(<VirtualOfficePet />);
  const quotesButton = screen.getByText(/Quotes/i);
  fireEvent.click(quotesButton);
  expect(screen.getByText('Inspirational quotes: Believe in yourself!')).toBeInTheDocument();
});

// Test if feedback closes after delay
// This test checks that feedback messages automatically disappear after a short time.
test('feedback message is removed after delay', async () => {
  jest.useFakeTimers();
  render(<VirtualOfficePet />);
  const quotesButton = screen.getByText(/Quotes/i);
  fireEvent.click(quotesButton);
  expect(screen.getByText('Inspirational quotes: Believe in yourself!')).toBeInTheDocument();
  jest.advanceTimersByTime(3000);
  await waitFor(() => expect(screen.queryByText('Inspirational quotes: Believe in yourself!')).not.toBeInTheDocument());
  jest.useRealTimers();
});
