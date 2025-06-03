import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Profile from "../pages/Profile";
import { act } from "react-dom/test-utils";

// Mock Firebase Auth
jest.mock("../firebase", () => ({
  auth: {
    currentUser: {
      uid: "12345",
      displayName: "Ahmad Test",
    },
  },
  db: {},
  storage: {}
}));

// Mock Firestore
jest.mock("firebase/firestore", () => {
  return {
    doc: jest.fn(() => "userDocRef"),
    getDoc: jest.fn(() =>
      Promise.resolve({
        exists: () => true,
        data: () => ({
          displayName: "Ahmad Test",
          dietaryRestrictions: "Vegetarian",
          currIngredients: "Milk, Eggs",
          photoURL: "https://example.com/photo.jpg",
        }),
      })
    ),
    setDoc: jest.fn()
  };
});

// Mock Firebase Storage (not tested directly here, but mocked to avoid errors)
jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(() => Promise.resolve("https://example.com/photo.jpg"))
}));

describe("Profile Component", () => {
  test("renders profile and loads user data", async () => {
    await act(async () => {
      render(<Profile />);
    });

    // Static elements
    expect(screen.getByText(/User Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Dietary Restrictions/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Ingredients/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();

    // Loaded data
    expect(screen.getByDisplayValue("Ahmad Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Vegetarian")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Milk, Eggs")).toBeInTheDocument();

    // Profile image
    const profileImg = screen.getByAltText("Profile");
    expect(profileImg).toBeInTheDocument();
    expect(profileImg).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  test("allows input changes for display name, dietary restrictions and ingredients", async () => {
    await act(async () => {
      render(<Profile />);
    });

    const nameInput = screen.getByPlaceholderText(/your name/i);
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    expect(nameInput.value).toBe("New Name");

    const dietaryInput = screen.getByPlaceholderText(/vegetarian, gluten-free/i);
    fireEvent.change(dietaryInput, { target: { value: "Vegan" } });
    expect(dietaryInput.value).toBe("Vegan");

    const ingredientsInput = screen.getByPlaceholderText(/Milk, Eggs, Bread/i);
    fireEvent.change(ingredientsInput, { target: { value: "Butter, Flour" } });
    expect(ingredientsInput.value).toBe("Butter, Flour");
  });
});
