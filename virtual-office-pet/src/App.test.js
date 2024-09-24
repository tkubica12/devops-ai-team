import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

// Test for adopting a pet
test('adopts a pet and updates mood and last action', () => {
  render(<VirtualOfficePet />);

  // Verify the initial state
  expect(screen.getByText(/Choose your pet:/i)).toBeInTheDocument();

  // Adopt a Dog
  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  // Check updated mood and last action
  expect(screen.getByText(/Mood: excited/i)).toBeInTheDocument();
  expect(screen.getByText(/Last action: Adopted/i)).toBeInTheDocument();
});

// Test for mood update upon action
test('feeds the pet and updates the mood to satisfied', () => {
  render(<VirtualOfficePet />);

  // Adopt a Dog
  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  // Feed the pet
  const feedButton = screen.getByText(/Feed/i);
  fireEvent.click(feedButton);

  // Check updated mood
  expect(screen.getByText(/Mood: satisfied/i)).toBeInTheDocument();
});

// Test for theme toggle
test('toggles theme to dark mode', () => {
  render(<VirtualOfficePet />);

  // Adopt a Dog
  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  // Toggle dark mode
  const toggleButton = screen.getByText(/Toggle Theme/i);
  fireEvent.click(toggleButton);

  // Check if the theme background color is dark
  expect(document.body.style.background).toBe('#333');
});
