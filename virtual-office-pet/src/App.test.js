import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualOfficePet from './App';

jest.mock('./hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => ({
    listen: jest.fn(),
    listening: false,
    stop: jest.fn(),
    voiceCommand: 'play',
    error: null,
  }),
}));

test('adopts a pet and updates mood and last action', () => {
  render(<VirtualOfficePet />);
  expect(screen.getByText(/Choose your pet:/i)).toBeInTheDocument();
  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);
  expect(screen.getByText(/Mood: excited/i)).toBeInTheDocument();
  expect(screen.getByText(/Last action: Adopted/i)).toBeInTheDocument();
});

test('recognizes voice command and updates last action', () => {
  render(<VirtualOfficePet />);
  const dogButton = screen.getByText(/Dog/i);
  fireEvent.click(dogButton);
  expect(screen.getByText(/Last action: Played/i)).toBeInTheDocument();
});