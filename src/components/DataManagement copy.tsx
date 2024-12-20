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

import React, { useRef } from "react";
import { Save, Database } from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export const DataManagement: React.FC = () => {
  const { exportData, importData } = useCourseStore();
  const { studentPasswords } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const courseData = exportData();
    const fullBackup = {
      courses: JSON.parse(courseData),
      studentPasswords,
      version: "1.0",
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sistema-calificaciones-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Backup exportado exitosamente");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const backup = JSON.parse(content);

          // Validate backup format
          if (!backup.courses || !backup.studentPasswords || !backup.version) {
            throw new Error("Formato de backup inválido");
          }

          // Import course data
          importData(JSON.stringify(backup.courses));

          // Import student passwords (you'll need to add this to useAuthStore)
          if (backup.studentPasswords) {
            // Update the store with the imported passwords
            useAuthStore.setState({
              studentPasswords: backup.studentPasswords,
            });
          }

          toast.success("Datos restaurados exitosamente");
        } catch (error) {
          console.error("Error importing backup:", error);
          toast.error("Error al importar el backup");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        title="Crear backup completo"
      >
        <Save className="w-4 h-4" />
        Backup
      </button>
      <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
        <Database className="w-4 h-4" />
        Restaurar
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
};
