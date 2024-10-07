import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

test('adopts a pet and updates mood and last action', () => {
  render(<VirtualOfficePet />);

  expect(screen.getByText(/Choose your pet:/i)).toBeInTheDocument();

  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  expect(screen.getByText(/Mood: excited/i)).toBeInTheDocument();
  expect(screen.getByText(/Last action: Adopted/i)).toBeInTheDocument();
});


// New test to simulate a pet's lifecycle ending

test('pet mood score decreases over time and pet passes away', async () => {
  jest.useFakeTimers(); // Use fake timers

  render(<VirtualOfficePet />);

  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  // Simulate time passing to reach zero mood score
  jest.advanceTimersByTime(70000); // Advance time

  await waitFor(() => expect(screen.getByText(/Your pet has passed away/i)).toBeInTheDocument());

  jest.useRealTimers(); // Cleanup timers
});