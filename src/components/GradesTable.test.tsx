// filepath: /src/components/GradesTable.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { GradesTable } from "./GradesTable";
import { useCourseStore } from "../store/useCourseStore";
import { Course } from "../types/course";

jest.mock("../store/useCourseStore");

const mockCourse: Course = {
  id: "course1",
  name: "Course 1",
  exams: ["Exam 1", "Exam 2"],
  students: [
    {
      id: "student1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      grades: [
        { id: "grade1", examName: "Exam 1", score: 80 },
        { id: "grade2", examName: "Exam 2", score: 90 },
      ],
      finalGrade: 170,
    },
  ],
};

const mockUpdateGrade = jest.fn();
const mockUpdateExamName = jest.fn();
const mockAddExam = jest.fn();
const mockDeleteExam = jest.fn();

beforeEach(() => {
  (useCourseStore as jest.Mock).mockReturnValue({
    updateGrade: mockUpdateGrade,
    updateExamName: mockUpdateExamName,
    addExam: mockAddExam,
    deleteExam: mockDeleteExam,
  });
});
test("renders GradesTable component", () => {
  const history = createMemoryHistory();
  render(
    <Router location={history.location} navigator={history}>
      <GradesTable course={mockCourse} onDeleteStudent={jest.fn()} />
    </Router>
  );
  expect(screen.getByText("John Doe")).toBeInTheDocument();
  expect(screen.getByText("Exam 1")).toBeInTheDocument();
  expect(screen.getByText("80")).toBeInTheDocument();
});
test("allows editing a grade", () => {
  const history = createMemoryHistory();
  render(
    <Router location={history.location} navigator={history}>
      <GradesTable course={mockCourse} onDeleteStudent={jest.fn()} />
    </Router>
  );
  fireEvent.click(screen.getByText("80"));
  fireEvent.change(screen.getByDisplayValue("80"), { target: { value: "85" } });
  fireEvent.keyDown(screen.getByDisplayValue("85"), { key: "Enter" });
  expect(mockUpdateGrade).toHaveBeenCalledWith(
    "course1",
    "student1",
    "grade1",
    85
  );
});
test("adds a new exam", () => {
  const history = createMemoryHistory();
  render(
    <Router location={history.location} navigator={history}>
      <GradesTable course={mockCourse} onDeleteStudent={jest.fn()} />
    </Router>
  );
  fireEvent.click(screen.getByText("Agregar Examen"));
  fireEvent.change(screen.getByPlaceholderText("Nombre del nuevo examen"), {
    target: { value: "Exam 3" },
  });
  fireEvent.click(screen.getByText("Agregar"));
  expect(mockAddExam).toHaveBeenCalledWith("course1", "Exam 3");
});
