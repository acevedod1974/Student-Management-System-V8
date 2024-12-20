import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../Button";

test("renders button with label", () => {
  render(<Button label="Click me" onClick={() => {}} />);
  const buttonElement = screen.getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
});

test("calls onClick when button is clicked", () => {
  const handleClick = jest.fn();
  render(<Button label="Click me" onClick={handleClick} />);
  const buttonElement = screen.getByText(/click me/i);
  fireEvent.click(buttonElement);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
