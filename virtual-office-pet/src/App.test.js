import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// Test for dark mode toggle
test('switches between light and dark mode', () => {
  render(<App />);

  // Check initial mode
  expect(screen.getByText(/switch to Dark mode/i)).toBeInTheDocument();

  // Toggle dark mode
  fireEvent.click(screen.getByText(/switch to Dark mode/i));

  // Verify mode switch
  expect(screen.getByText(/switch to Light mode/i)).toBeInTheDocument();
});
