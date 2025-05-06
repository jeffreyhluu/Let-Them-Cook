// jest.config.js
module.exports = {
    clearMocks: true,
  
    testEnvironment: 'node',
  
    // Match test files with .test.js or .spec.js
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  
    collectCoverage: true,
  
    collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/**/*.test.js'],
  
    coverageDirectory: 'coverage',

    setupFilesAfterEnv: ['src/__tests__/setupTests.js']
};