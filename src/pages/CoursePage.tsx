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

import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { GradesTable } from '../components/GradesTable';
import { CourseStats } from '../components/CourseStats';
import { GradeDistributionChart } from '../components/GradeDistributionChart';
import { ExamPerformanceChart } from '../components/ExamPerformanceChart';
import { StudentForm } from '../components/StudentForm';
import { DataManagement } from '../components/DataManagement';
import { useCourseStore } from '../store/useCourseStore';
import toast from 'react-hot-toast';

export const CoursePage: React.FC = () => {
  const { courseId } = useParams();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const { courses, addStudent, deleteStudent } = useCourseStore();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return <Navigate to="/" replace />;
  }

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
      deleteStudent(course.id, studentId);
      toast.success('Estudiante eliminado exitosamente');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
        </div>
        <div className="flex gap-4">
          <DataManagement />
          <button
            onClick={() => setShowAddStudent(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <UserPlus className="w-4 h-4" />
            Agregar Estudiante
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CourseStats course={course} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Distribución de Notas</h2>
          <GradeDistributionChart course={course} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Rendimiento por Examen</h2>
          <ExamPerformanceChart course={course} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Calificaciones Detalladas</h2>
        </div>
        <div className="p-6">
          <GradesTable course={course} onDeleteStudent={handleDeleteStudent} />
        </div>
      </div>

      {showAddStudent && (
        <StudentForm
          courseId={course.id}
          onSubmit={addStudent}
          onClose={() => setShowAddStudent(false)}
        />
      )}
    </div>
  );
};