import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ActivityLogViewer } from "./ActivityLogViewer";
import { useActivityLog } from "../hooks/useActivityLog";
import "@testing-library/jest-dom";

// Mock the useActivityLog hook
jest.mock("../hooks/useActivityLog");

const mockLogs = [
  {
    id: "1",
    userId: "user1",
    action: "create_student",
    entityType: "student" as const,
    entityId: "student1",
    timestamp: "2024-04-07T10:00:00Z",
    details: { name: "John Doe" },
  },
  {
    id: "2",
    userId: "user1",
    action: "update_grade",
    entityType: "grade" as const,
    entityId: "grade1",
    timestamp: "2024-04-07T11:00:00Z",
    details: { oldGrade: 85, newGrade: 90 },
  },
];

describe("ActivityLogViewer", () => {
  beforeEach(() => {
    (useActivityLog as jest.Mock).mockReturnValue({
      getActivityLogs: jest.fn().mockResolvedValue(mockLogs),
    });
  });

  it("renders activity logs table", async () => {
    render(<ActivityLogViewer />);

    await waitFor(() => {
      expect(screen.getByText("Activity Logs")).toBeInTheDocument();
      expect(screen.getByText("create_student")).toBeInTheDocument();
      expect(screen.getByText("update_grade")).toBeInTheDocument();
    });
  });

  it("applies type filter", async () => {
    const mockGetLogs = jest.fn().mockResolvedValue(mockLogs);
    (useActivityLog as jest.Mock).mockReturnValue({
      getActivityLogs: mockGetLogs,
    });

    render(<ActivityLogViewer />);

    const typeSelect = screen.getByLabelText("Type");
    fireEvent.change(typeSelect, { target: { value: "student" } });

    await waitFor(() => {
      expect(mockGetLogs).toHaveBeenCalledWith(
        expect.objectContaining({ entityType: "student" })
      );
    });
  });

  it("handles pagination", async () => {
    render(<ActivityLogViewer />);

    await waitFor(() => {
      expect(screen.getByText("Page 1")).toBeInTheDocument();
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Page 2")).toBeInTheDocument();
    });
  });

  it("formats dates correctly", async () => {
    render(<ActivityLogViewer />);

    await waitFor(() => {
      const formattedDate = new Date("2024-04-07T10:00:00Z").toLocaleString();
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });
  });

  it("displays entity badges with correct colors", async () => {
    render(<ActivityLogViewer />);

    await waitFor(() => {
      const studentBadge = screen.getByText("student");
      const gradeBadge = screen.getByText("grade");

      expect(studentBadge).toHaveClass("bg-blue-100", "text-blue-800");
      expect(gradeBadge).toHaveClass("bg-purple-100", "text-purple-800");
    });
  });
});
