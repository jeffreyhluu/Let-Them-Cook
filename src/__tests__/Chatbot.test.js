import React from 'react';
import { render } from '@testing-library/react';
import Chatbot from '../Components/Chatbot.jsx';
import { screen } from '@testing-library/react';

beforeAll(() => {
    // Jest doesn't implement scrollIntoView in JSDOM by default
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

test('Chatbot renders without crashing', () => {
  render(<Chatbot />);
});

test('Chatbot UI elements render correctly', () => {
  render(<Chatbot />);

  // Check for header text
  expect(screen.getByText(/Yummerz - Recipe Assistant/i)).toBeInTheDocument();

  // Check for input field with correct placeholder
  expect(screen.getByPlaceholderText(/Type ingredients \(e\.g\., eggs, spinach\)/i)).toBeInTheDocument();

});