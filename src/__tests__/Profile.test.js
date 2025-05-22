import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../pages/Profile";

// Mock Firebase auth and Firestore functions
jest.mock("../firebase", () => ({
  auth: {
    currentUser: {
      uid: "12345",
      displayName: "Ahmad Test",
    },
    db: {},       // dummy placeholder if needed
  },
  db: {}, // dummy placeholder
}));

// Mock Firestore functions used inside Profile
jest.mock("firebase/firestore", () => {
  return {
    doc: jest.fn(() => "userDocRef"),
    getDoc: jest.fn(async () => ({
      exists: () => true,
      data: () => ({
        displayName: "Ahmad Test",
        dietaryRestrictions: "Vegetarian",
        currIngredients: "Milk, Eggs",
        photoURL: "https://example.com/photo.jpg",
      }),
    })),
  };
});

describe("Profile Component", () => {
  test("renders profile headings and profile image", async () => {
    render(<Profile />);

    // Check static headings immediately
    expect(screen.getByText(/User Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Dietary Restrictions/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Ingredients/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();

    // Wait for async data to load and verify profile data rendered
    expect(await screen.findByDisplayValue("Ahmad Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Vegetarian")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Milk, Eggs")).toBeInTheDocument();

    // Check profile image rendered with correct src and alt
    const profileImg = screen.getByAltText("Profile");
    expect(profileImg).toBeInTheDocument();
    expect(profileImg).toHaveAttribute("src", "https://example.com/photo.jpg");
  });
});
