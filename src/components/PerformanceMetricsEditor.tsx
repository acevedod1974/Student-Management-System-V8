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

import React, { useState } from "react";
import { Save } from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";
import toast from "react-hot-toast";

interface PerformanceMetricsEditorProps {
  courseId: string;
  studentId: string;
  currentMetrics: {
    attendance: number;
    participation: number;
  };
  onClose: () => void; // Add this line
}

export const PerformanceMetricsEditor: React.FC<
  PerformanceMetricsEditorProps
> = ({
  courseId,
  studentId,
  currentMetrics,
  onClose, // Add this line
}) => {
  const [metrics, setMetrics] = useState(currentMetrics);
  const { updatePerformanceMetrics } = useCourseStore();

  const handleSave = () => {
    if (
      metrics.attendance < 0 ||
      metrics.attendance > 100 ||
      metrics.participation < 0 ||
      metrics.participation > 100
    ) {
      toast.error("Los valores deben estar entre 0 y 100");
      return;
    }

    updatePerformanceMetrics(courseId, studentId, metrics);
    toast.success("Métricas actualizadas exitosamente");
    onClose(); // Call onClose after saving
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Asistencia (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={metrics.attendance}
          onChange={(e) =>
            setMetrics({ ...metrics, attendance: Number(e.target.value) })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Participación (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={metrics.participation}
          onChange={(e) =>
            setMetrics({ ...metrics, participation: Number(e.target.value) })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        <Save className="w-4 h-4" />
        Guardar Métricas
      </button>
    </div>
  );
};
