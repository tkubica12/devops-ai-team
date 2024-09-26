import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

test('allows user to choose and adopt a pet', () => {
  render(<VirtualOfficePet />);

  // Check if the initial prompt is present
  expect(screen.getByText(/Choose your pet:/i)).toBeInTheDocument();

  // Click on the Dog button to adopt a dog
  fireEvent.click(screen.getByLabelText(/Adopt Dog/i));

  // Confirm mood and action updates
  expect(screen.getByText(/Mood: excited/i)).toBeInTheDocument();
  expect(screen.getByText(/Last action: Adopted/i)).toBeInTheDocument();
});

test('performs pet actions and updates mood score', () => {
  render(<VirtualOfficePet />);

  // Adopt a dog
  fireEvent.click(screen.getByLabelText(/Adopt Dog/i));

  // Perform action 'Feed'
  fireEvent.click(screen.getByText(/Feed/i));
  expect(screen.getByText(/Last action: Fed/i)).toBeInTheDocument();
});
