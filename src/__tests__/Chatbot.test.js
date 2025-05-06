import React from 'react';
import { render } from '@testing-library/react';
import Chatbot from '../Components/Chatbot.jsx';

beforeAll(() => {
    // Jest doesn't implement scrollIntoView in JSDOM by default
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

test('Chatbot renders without crashing', () => {
  render(<Chatbot />);
});