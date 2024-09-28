import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App'; // Import the VirtualOfficePet component

const mockCommandHandler = jest.fn();

jest.mock('./components/VoiceCommands', () => ({ onCommand }) => (
  <div>
    <button onClick={() => onCommand('play')}>Simulated Play Command</button>
    <button onClick={() => onCommand('sleep')}>Simulated Sleep Command</button>
  </div>
));

test('adopts a pet and updates mood and last action', () => {
  render(<VirtualOfficePet />);

  expect(screen.getByText(/Choose your pet:/i)).toBeInTheDocument();

  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  expect(screen.getByText(/Mood: excited/i)).toBeInTheDocument();
  expect(screen.getByText(/Last action: Adopted/i)).toBeInTheDocument();
});

test('handles voice commands and updates last action', () => {
  render(<VirtualOfficePet />);

  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);

  const playCommandButton = screen.getByText(/Simulated Play Command/i);
  fireEvent.click(playCommandButton);

  expect(screen.getByText(/Mood: happy/i)).toBeInTheDocument();
  expect(screen.getByText(/Last action: Play Commanded/i)).toBeInTheDocument();

  const sleepCommandButton = screen.getByText(/Simulated Sleep Command/i);
  fireEvent.click(sleepCommandButton);

  expect(screen.getByText(/Last action: Sleep Commanded/i)).toBeInTheDocument();
});
