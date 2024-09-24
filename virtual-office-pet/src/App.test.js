import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App'; // Import the VirtualOfficePet component

test('adopts a pet and updates mood and last action', () => {
  render(<VirtualOfficePet />);

  expect(screen.getByText(/Choose your pet:/i)).toBeInTheDocument();

  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  expect(screen.getByText(/Mood: excited/i)).toBeInTheDocument();
  expect(screen.getByText(/Last action: Adopted/i)).toBeInTheDocument();
});

test('performs a talk action', () => {
  render(<VirtualOfficePet />);

  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  const talkAction = screen.getByText(/Talk/i);
  fireEvent.click(talkAction);

  expect(screen.getByText(/Last action: Talked/i)).toBeInTheDocument();
});