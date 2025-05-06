import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../pages/Profile";
import { auth } from "../firebase";

jest.mock("../firebase", () => ({
  auth: {
    currentUser: {
      displayName: "Ahmad Test"
    }
  }
}));

describe("Profile Component", () => {
  test("renders profile headings", () => {
    render(<Profile />);
    expect(screen.getByText(/User Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Dietary Restrictions/i)).toBeInTheDocument();
    expect(screen.getByText(/Shopping List/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});
