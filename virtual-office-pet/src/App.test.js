import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

test('activates voice command and performs action', async () => {
  render(<VirtualOfficePet />);

  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  const voiceButton = screen.getByText(/Voice Command/i);
  fireEvent.click(voiceButton);

  expect(screen.getByText(/Listening.../i)).toBeInTheDocument();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  expect(screen.getByText(/Last action: Fed/i)).toBeInTheDocument();
});