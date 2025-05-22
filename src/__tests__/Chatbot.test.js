import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Chatbot from '../Components/Chatbot.jsx';

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

test('Chatbot renders without crashing', async () => {
  render(<Chatbot />);
  // Wait for an element that appears after async update
  await waitFor(() => {
    expect(screen.getByText(/Yummerz - Recipe Assistant/i)).toBeInTheDocument();
  });
});

test('Chatbot UI elements render correctly', async () => {
  render(<Chatbot />);
  expect(screen.getByPlaceholderText(/Type ingredients \(e\.g\., eggs, spinach\)/i)).toBeInTheDocument();

  // Wait for the header text asynchronously if it appears after a fetch
  await waitFor(() => {
    expect(screen.getByText(/Yummerz - Recipe Assistant/i)).toBeInTheDocument();
  });
});
