import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

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

test('performs pet actions and updates last action', () => {
  render(<VirtualOfficePet />);

  // Adopt a pet
  fireEvent.click(screen.getByText(/Dog/i));

  // Perform Feed action
  const feedButton = screen.getByText(/Feed/i);
  fireEvent.click(feedButton);
  expect(screen.getByText(/Last action: Fed/i)).toBeInTheDocument();

  // Perform Talk action
  const talkButton = screen.getByText(/Talk/i);
  fireEvent.click(talkButton);
  expect(screen.getByText(/Last action: Talked/i)).toBeInTheDocument();
});