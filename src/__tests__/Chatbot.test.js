import React from 'react';
import { render } from '@testing-library/react';
import Chatbot from '../Components/Chatbot.jsx';

test('Chatbot renders without crashing', () => {
  render(<Chatbot />);
});