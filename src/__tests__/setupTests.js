// setupTests.js

import '@testing-library/jest-dom'; 
import '@testing-library/jest-dom/extend-expect';

// Example: Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Example: Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});