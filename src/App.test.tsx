// filepath: /src/App.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

test("renders the Dashboard page", () => {
  render(
    <Router>
      <App />
    </Router>
  );
  expect(screen.getByText("Dashboard")).toBeInTheDocument();
});

test("navigates to CoursePage", () => {
  render(
    <Router>
      <App />
    </Router>
  );
  fireEvent.click(screen.getByText("Course 1"));
  expect(screen.getByText("Course 1")).toBeInTheDocument();
});
