import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NearestGroceryStore from "../pages/NearestGroceryStore";

beforeAll(() => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn((success, error) => error()), // force deny
  };
});

beforeAll(() => {
  jest.spyOn(window, "confirm").mockReturnValue(false);
});

describe("NearestGroceryStore Component", () => {
  test("renders title and zip code form when location is denied", () => {
    render(<NearestGroceryStore />);

    expect(screen.getByText(/Nearest Grocery Stores/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/e.g., 98105/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Find Stores/i })).toBeInTheDocument();
  });
});