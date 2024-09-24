import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App'; // Import the VirtualOfficePet component

test('adopts a pet and updates mood and last action', () => {
  render(<VirtualOfficePet />);

  // Check if the initial text is present
  expect(screen.getByText(/Choose your pet:/i)).toBeInTheDocument();

  // Click on the Dog button to adopt a dog
  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  // Check if the pet's mood and last action are updated
  expect(screen.getByText(/Mood: excited/i)).toBeInTheDocument();
  expect(screen.getByText(/Last action: Adopted/i)).toBeInTheDocument();
});

// Add tests for theme and mood logic

test('validates theme change logic', () => {
  // Your mock or state-based tests for theme changes
});

test('dynamically checks mood changes based on action', () => {
  // Your tests for dynamically checking mood changes
});
