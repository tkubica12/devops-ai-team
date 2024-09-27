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

// Additional user behavior test
test('opens customization menu when customize button is clicked', () => {
  render(<VirtualOfficePet />);

  const customizeButton = screen.getByText(/Customize/i);
  fireEvent.click(customizeButton);

  expect(screen.getByText(/Customize Your Pet/i)).toBeInTheDocument();
});
