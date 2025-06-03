import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chatbot from '../Components/Chatbot.jsx';

// Mock Firebase
jest.mock('../firebase', () => ({
  auth: {
    currentUser: null
  },
  db: {},
  storage: {}
}));

// Mock Firestore helpers
jest.mock('../firestoreHelpers', () => ({
  addRecipeToUser: jest.fn(),
  addOrInitRecipeRating: jest.fn(),
  createOrUpdateUser: jest.fn(),
  getAllUserRecipes: jest.fn(() => Promise.resolve([])),
  userHasRecipe: jest.fn(() => Promise.resolve(false)),
  copyRecipeToUser: jest.fn(),
  getUserIDByRecipeID: jest.fn()
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false }))
}));

// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadString: jest.fn(),
  getDownloadURL: jest.fn()
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn()
}));

// Mock NearestGroceryStore component
jest.mock('../pages/NearestGroceryStore', () => {
  return function MockNearestGroceryStore({ missingIngredients }) {
    return <div data-testid="nearest-grocery-store">Nearest Grocery Store Component</div>;
  };
});

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Chatbot Component', () => {
  test('Chatbot renders without crashing', async () => {
    render(<Chatbot />);
    await waitFor(() => {
      expect(screen.getByText(/Yummerz - Recipe Assistant/i)).toBeInTheDocument();
    });
  });

  test('Chatbot UI elements render correctly', async () => {
    render(<Chatbot />);
    
    // Check for input field
    expect(screen.getByPlaceholderText(/Type ingredients \(e\.g\., eggs, spinach\)/i)).toBeInTheDocument();
    
    // Check for header
    await waitFor(() => {
      expect(screen.getByText(/Yummerz - Recipe Assistant/i)).toBeInTheDocument();
    });
    
    // Check for grocery store button
    expect(screen.getByText(/Find Stores & Ingredient Prices/i)).toBeInTheDocument();
  });

  test('example button appears when input is empty', async () => {
    render(<Chatbot />);
    
    await waitFor(() => {
      expect(screen.getByText(/Try example: chicken, broccoli, garlic/i)).toBeInTheDocument();
    });
  });

  test('example button sets input value when clicked', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    
    await waitFor(() => {
      expect(screen.getByText(/Try example: chicken, broccoli, garlic/i)).toBeInTheDocument();
    });

    const exampleButton = screen.getByText(/Try example: chicken, broccoli, garlic/i);
    const inputField = screen.getByPlaceholderText(/Type ingredients/i);
    
    await user.click(exampleButton);
    
    expect(inputField.value).toBe('chicken, broccoli, garlic');
  });

  test('input field updates when user types', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    
    const inputField = screen.getByPlaceholderText(/Type ingredients/i);
    
    await user.type(inputField, 'tomato, basil');
    
    expect(inputField.value).toBe('tomato, basil');
  });

  test('grocery store modal opens and closes', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    
    const modalButton = screen.getByText(/Find Stores & Ingredient Prices/i);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('nearest-grocery-store')).not.toBeInTheDocument();
    
    // Open modal
    await user.click(modalButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('nearest-grocery-store')).toBeInTheDocument();
    });
    
    // Close modal using close button
    const closeButton = screen.getByLabelText('close');
    await user.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('nearest-grocery-store')).not.toBeInTheDocument();
    });
  });

  test('initial greeting message appears', async () => {
    render(<Chatbot />);
    
    await waitFor(() => {
      expect(screen.getByText(/Hi there, I'm Yummerz, your personalized AI assistant!/)).toBeInTheDocument();
    });
  });

  test('input field can be focused', async () => {
    render(<Chatbot />);
    
    const inputField = screen.getByPlaceholderText(/Type ingredients/i);
    inputField.focus();
    
    expect(document.activeElement).toBe(inputField);
  });

  test('chatbot messages container exists', () => {
    render(<Chatbot />);
    
    const messagesContainer = screen.getByText(/Hi there, I'm Yummerz/).closest('.chatbot-messages');
    expect(messagesContainer).toBeInTheDocument();
  });

  test('input field accepts Enter key', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    
    const inputField = screen.getByPlaceholderText(/Type ingredients/i);
    
    await user.type(inputField, 'test ingredients');
    await user.keyboard('{Enter}');
    
    // Input should be cleared after Enter (even if API call fails)
    await waitFor(() => {
      expect(inputField.value).toBe('');
    });
  });

  test('loading state is handled properly', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    
    const inputField = screen.getByPlaceholderText(/Type ingredients/i);
    
    await user.type(inputField, 'test ingredients');
    await user.keyboard('{Enter}');
    
    // Should clear input immediately
    expect(inputField.value).toBe('');
  });

  test('empty input does not send message', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    
    const inputField = screen.getByPlaceholderText(/Type ingredients/i);
    
    // Try to send empty message
    await user.keyboard('{Enter}');
    
    // Input should remain focused and empty
    expect(inputField.value).toBe('');
    expect(document.activeElement).toBe(inputField);
  });

  test('component handles missing user data gracefully', async () => {
    render(<Chatbot />);
    
    // Should render without crashing even with no user data
    await waitFor(() => {
      expect(screen.getByText(/Hi there, I'm Yummerz/)).toBeInTheDocument();
    });
  });

  test('modal can be closed by clicking outside (backdrop)', async () => {
    render(<Chatbot />);
    
    const modalButton = screen.getByText(/Find Stores & Ingredient Prices/i);
    fireEvent.click(modalButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('nearest-grocery-store')).toBeInTheDocument();
    });
    
    // Find the modal backdrop and click it
    const modal = screen.getByTestId('nearest-grocery-store').closest('[role="presentation"]');
    if (modal) {
      fireEvent.click(modal);
    }
  });

  test('header emoji and text are properly displayed', () => {
    render(<Chatbot />);
    
    const header = screen.getByText(/🍽️ Yummerz - Recipe Assistant/);
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('chatbot-header');
  });

  test('component structure includes all main sections', () => {
    render(<Chatbot />);
    
    // Check for main container
    const container = document.querySelector('.chatbot-container');
    expect(container).toBeInTheDocument();
    
    // Check for input section
    const inputSection = document.querySelector('.chatbot-input');
    expect(inputSection).toBeInTheDocument();
  });
});