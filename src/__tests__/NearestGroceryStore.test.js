import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NearestGroceryStore from "../pages/NearestGroceryStore";

// Mock global fetch
global.fetch = jest.fn();

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;

// Mock confirm dialog
beforeEach(() => {
  jest.spyOn(window, "confirm").mockClear();
  fetch.mockClear();
});

describe("NearestGroceryStore Component", () => {
  test("renders title and form if location is denied", async () => {
    window.confirm = jest.fn(() => false); // User denies location

    render(<NearestGroceryStore />);

    expect(await screen.findByText(/Nearest Grocery Stores/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., 98105/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Find Stores/i })).toBeInTheDocument();
  });

  test("fetches stores when ZIP code is entered", async () => {
    window.confirm = jest.fn(() => false); // No location access

    // Mock geocode response
    fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          {
            geometry: {
              location: { lat: 47.65, lng: -122.3 }
            }
          }
        ]
      }),
    });

    // Mock nearby stores response
    fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          {
            name: "Local Grocery",
            vicinity: "123 Main St",
            rating: 4.5,
            place_id: "store123"
          }
        ]
      }),
    });

    render(<NearestGroceryStore missingIngredients={[
      { ingredient: "Milk", price: 3.5, unit: "liter" }
    ]} />);

    const input = screen.getByPlaceholderText(/e.g., 98105/i);
    fireEvent.change(input, { target: { value: "98105" } });

    const button = screen.getByRole("button", { name: /Find Stores/i });
    fireEvent.click(button);

    // Wait for store data to load
    await waitFor(() => {
      expect(screen.getByText("Local Grocery")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("4.5")).toBeInTheDocument();
      expect(screen.getByText("$3.5 / liter")).toBeInTheDocument();
    });
  });

  test("shows error on invalid ZIP code", async () => {
    window.confirm = jest.fn(() => false);

    render(<NearestGroceryStore />);

    const input = screen.getByPlaceholderText(/e.g., 98105/i);
    fireEvent.change(input, { target: { value: "12" } });

    const button = screen.getByRole("button", { name: /Find Stores/i });
    fireEvent.click(button);

    expect(await screen.findByText(/Please enter a valid 5-digit ZIP code/i)).toBeInTheDocument();
  });

  test("handles no stores found", async () => {
    window.confirm = jest.fn(() => false);

    fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          {
            geometry: { location: { lat: 47.6, lng: -122.3 } }
          }
        ]
      }),
    });

    fetch.mockResolvedValueOnce({
      json: async () => ({ results: [] }) // No stores
    });

    render(<NearestGroceryStore />);

    const input = screen.getByPlaceholderText(/e.g., 98105/i);
    fireEvent.change(input, { target: { value: "98105" } });

    const button = screen.getByRole("button", { name: /Find Stores/i });
    fireEvent.click(button);

    expect(await screen.findByText(/No grocery stores found/i)).toBeInTheDocument();
  });

  test("fetches stores via location if user allows", async () => {
    window.confirm = jest.fn(() => true); // User allows location

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
      success({ coords: { latitude: 47.6, longitude: -122.3 } });
    });

    fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          {
            name: "Geo Store",
            vicinity: "456 Market St",
            rating: 4.8,
            place_id: "store456"
          }
        ]
      }),
    });

    render(<NearestGroceryStore />);

    expect(await screen.findByText("Geo Store")).toBeInTheDocument();
    expect(screen.getByText("456 Market St")).toBeInTheDocument();
  });
});
