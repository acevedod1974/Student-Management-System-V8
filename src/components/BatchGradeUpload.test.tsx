import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BatchGradeUpload } from "./BatchGradeUpload";
import { api } from "../services/api";
import "@testing-library/jest-dom";

jest.mock("../services/api", () => ({
  api: {
    grades: {
      bulkCreate: jest.fn(),
    },
  },
}));

describe("BatchGradeUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createFile = (content: string): File => {
    return new File([content], "grades.csv", { type: "text/csv" });
  };

  const mockCSVContent = `studentId,courseId,grade,date
student1,course1,85,2024-04-07
student2,course1,92,2024-04-07`;

  it("renders file input", () => {
    render(<BatchGradeUpload />);
    expect(
      screen.getByRole("button", { name: /choose file/i })
    ).toBeInTheDocument();
  });

  it("shows preview when valid CSV is uploaded", async () => {
    render(<BatchGradeUpload />);
    const file = createFile(mockCSVContent);
    const input = screen.getByRole("button", { name: /choose file/i });

    Object.defineProperty(input, "files", {
      value: [file],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText("Preview (2 grades)")).toBeInTheDocument();
      expect(screen.getByText("student1")).toBeInTheDocument();
      expect(screen.getByText("85")).toBeInTheDocument();
    });
  });

  it("validates grade values", async () => {
    const invalidCSV = `studentId,courseId,grade,date
student1,course1,invalid,2024-04-07`;

    render(<BatchGradeUpload />);
    const file = createFile(invalidCSV);
    const input = screen.getByRole("button", { name: /choose file/i });

    Object.defineProperty(input, "files", {
      value: [file],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText("Preview (1 grades)")).toBeInTheDocument();
      const uploadButton = screen.getByRole("button", {
        name: /upload grades/i,
      });
      fireEvent.click(uploadButton);
      expect(screen.getByText(/invalid grade value/i)).toBeInTheDocument();
    });
  });

  it("calls api.grades.bulkCreate with valid data", async () => {
    render(<BatchGradeUpload />);
    const file = createFile(mockCSVContent);
    const input = screen.getByRole("button", { name: /choose file/i });

    Object.defineProperty(input, "files", {
      value: [file],
    });

    fireEvent.change(input);

    await waitFor(() => {
      const uploadButton = screen.getByRole("button", {
        name: /upload grades/i,
      });
      fireEvent.click(uploadButton);
      expect(api.grades.bulkCreate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            studentId: "student1",
            courseId: "course1",
            grade: 85,
          }),
        ])
      );
    });
  });

  it("clears preview when clear button is clicked", async () => {
    render(<BatchGradeUpload />);
    const file = createFile(mockCSVContent);
    const input = screen.getByRole("button", { name: /choose file/i });

    Object.defineProperty(input, "files", {
      value: [file],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText("Preview (2 grades)")).toBeInTheDocument();
      const clearButton = screen.getByRole("button", { name: /clear/i });
      fireEvent.click(clearButton);
      expect(screen.queryByText("Preview (2 grades)")).not.toBeInTheDocument();
    });
  });
});
