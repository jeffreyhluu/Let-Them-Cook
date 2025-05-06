module.exports = {
    clearMocks: true,
  
    testEnvironment: 'node',
  
    // Match test files with .test.js or .spec.js
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  
    collectCoverage: true,
  
    collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/**/*.test.js'],
  
    coverageDirectory: 'coverage',
  
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
    // Add Babel transformation for JS and JSX files
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest' // This will transform JS/JSX files using babel-jest
    }
  };
  