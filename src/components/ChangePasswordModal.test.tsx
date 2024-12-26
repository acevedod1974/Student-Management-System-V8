// filepath: /src/components/ChangePasswordModal.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChangePasswordModal from "./ChangePasswordModal";
import { useAuthStore } from "../store/useAuthStore";

jest.mock("../store/useAuthStore");

const mockChangePassword = jest.fn();

beforeEach(() => {
  (useAuthStore as jest.Mock).mockReturnValue({
    user: { email: "test@example.com", role: "student" },
    changePassword: mockChangePassword,
  });
});

test("renders ChangePasswordModal component", () => {
  render(<ChangePasswordModal onClose={jest.fn()} />);
  expect(screen.getByText("Cambiar Contraseña")).toBeInTheDocument();
});

test("changes password successfully", () => {
  render(<ChangePasswordModal onClose={jest.fn()} />);
  fireEvent.change(screen.getByLabelText("Contraseña Actual"), {
    target: { value: "oldPassword" },
  });
  fireEvent.change(screen.getByLabelText("Nueva Contraseña"), {
    target: { value: "newPassword" },
  });
  fireEvent.change(screen.getByLabelText("Confirmar Nueva Contraseña"), {
    target: { value: "newPassword" },
  });
  fireEvent.click(screen.getByText("Cambiar Contraseña"));
  expect(mockChangePassword).toHaveBeenCalledWith(
    "test@example.com",
    "oldPassword",
    "newPassword"
  );
});
