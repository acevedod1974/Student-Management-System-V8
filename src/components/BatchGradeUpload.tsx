import React, { useState, useRef } from "react";
import { api } from "../services/api";
import { useApiError } from "../hooks/useApiError";
import { LoadingState } from "./LoadingState";
import { sanitizeInput } from "../utils/validation";

interface GradeData {
  studentId: string;
  courseId: string;
  grade: number;
  date: string;
}

export function BatchGradeUpload() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<GradeData[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { handleError } = useApiError();

  const parseCSV = (content: string): GradeData[] => {
    const lines = content.split("\n");
    const headers = lines[0].toLowerCase().split(",");

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",");
        const entry: Partial<GradeData> = {};

        headers.forEach((header, index) => {
          const value = sanitizeInput(values[index]?.trim() || "");
          entry[header] = header === "grade" ? Number(value) : value;
        });

        return entry as GradeData;
      });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = parseCSV(content);
        setPreview(data);
      } catch {
        handleError(
          new Error("Failed to parse CSV file. Please check the format.")
        );
      }
    };
    reader.readAsText(file);
  };

  const validateGrades = (grades: GradeData[]): string[] => {
    const errors: string[] = [];

    grades.forEach((grade, index) => {
      if (!grade.studentId) errors.push(`Row ${index + 1}: Missing student ID`);
      if (!grade.courseId) errors.push(`Row ${index + 1}: Missing course ID`);
      if (isNaN(grade.grade) || grade.grade < 0 || grade.grade > 100) {
        errors.push(`Row ${index + 1}: Invalid grade value`);
      }
      if (!grade.date || isNaN(Date.parse(grade.date))) {
        errors.push(`Row ${index + 1}: Invalid date format`);
      }
    });

    return errors;
  };

  const handleSubmit = async () => {
    if (preview.length === 0) {
      handleError(new Error("No grades to upload"));
      return;
    }

    const errors = validateGrades(preview);
    if (errors.length > 0) {
      handleError(new Error(`Validation errors:\n${errors.join("\n")}`));
      return;
    }

    try {
      setLoading(true);
      await api.grades.bulkCreate(preview);
      setPreview([]);
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPreview([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Batch Grade Upload</h2>

      <div className="mb-4">
        <input
          type="file"
          ref={fileRef}
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={loading}
        />
      </div>

      {preview.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="font-medium mb-2">
              Preview ({preview.length} grades)
            </h3>
            <div className="max-h-60 overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Student ID</th>
                    <th className="px-4 py-2">Course ID</th>
                    <th className="px-4 py-2">Grade</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((grade, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{grade.studentId}</td>
                      <td className="px-4 py-2">{grade.courseId}</td>
                      <td className="px-4 py-2">{grade.grade}</td>
                      <td className="px-4 py-2">{grade.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? <LoadingState size="small" /> : "Upload Grades"}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}
