/**
 *
 * Student Management System
 *
 * Description: The Student Management System is a comprehensive web application designed to manage student data efficiently.
 * Built with modern web technologies, this system offers a robust and user-friendly interface for managing courses, students, and their performance.
 *
 * Technologies Used:
 * - React
 * - TypeScript
 * - Zustand (State Management)
 * - Tailwind CSS (Styling)
 * - Vite (Building and Serving)
 *
 * Author: Daniel Acevedo Lopez
 * GitHub: https://github.com/acevedod1974/Student-Management-System-V4
 *
 * Copyright © 2023 Daniel Acevedo Lopez. All rights reserved.
 *
 * This project is licensed under the MIT License. See the LICENSE file for more details.
 */

import React, { useMemo, useState, useCallback } from "react";

interface Props {
  grades: Array<{
    studentId: string;
    name: string;
    grade: number;
    date: string;
  }>;
  onEditGrade?: (studentId: string, grade: number) => void;
}

const ITEMS_PER_PAGE = 10;

function GradesTable({ grades, onEditGrade }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"name" | "grade" | "date">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedAndPaginatedGrades = useMemo(() => {
    const sorted = [...grades].sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [grades, currentPage, sortField, sortDirection]);

  const totalPages = Math.ceil(grades.length / ITEMS_PER_PAGE);

  const handleSort = useCallback(
    (field: "name" | "grade" | "date") => {
      if (field === sortField) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th
              className="px-6 py-3 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Student Name{" "}
              {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 cursor-pointer"
              onClick={() => handleSort("grade")}
            >
              Grade{" "}
              {sortField === "grade" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date{" "}
              {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndPaginatedGrades.map(({ studentId, name, grade, date }) => (
            <tr key={studentId} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{name}</td>
              <td className="px-6 py-4">{grade}</td>
              <td className="px-6 py-4">
                {new Date(date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                {onEditGrade && (
                  <button
                    onClick={() => onEditGrade(studentId, grade)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(GradesTable);
