import React, { useState } from "react";
import { exportData } from "../utils/export";
import { useApiError } from "../hooks/useApiError";
import { LoadingState } from "./LoadingState";
import { api } from "../services/api";

export function DataManagement() {
  const [loading, setLoading] = useState(false);
  const { handleError } = useApiError();

  const handleExport = async (
    type: "students" | "courses" | "grades",
    format: "csv" | "json"
  ) => {
    try {
      setLoading(true);
      let data;

      switch (type) {
        case "students":
          data = await api.students.getAll();
          break;
        case "courses":
          data = await api.courses.getAll();
          break;
        case "grades": {
          // Get all courses first to map course names
          const courses = await api.courses.getAll();
          const courseMap = Object.fromEntries(
            courses.map((course) => [course.id, course.name])
          );

          // Get all grades and enhance with course names
          const grades = await Promise.all(
            courses.map((course) => api.grades.getByCourseId(course.id))
          );

          data = grades.flat().map((grade) => ({
            ...grade,
            courseName: courseMap[grade.courseId] || "Unknown Course",
          }));
          break;
        }
      }

      exportData(data, {
        format,
        fileName: `${type}-${new Date().toISOString().split("T")[0]}`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Data Management</h2>

      {loading && (
        <div className="mb-4">
          <LoadingState message="Preparing data export..." />
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Export Students</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport("students", "csv")}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExport("students", "json")}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Export as JSON
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Export Courses</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport("courses", "csv")}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExport("courses", "json")}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Export as JSON
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Export Grades</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport("grades", "csv")}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExport("grades", "json")}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
