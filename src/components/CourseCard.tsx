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

import React from 'react';
import { Course } from '../types/course';
import { Users, GraduationCap } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onClick: () => void;
  studentView?: boolean;
  studentGrades?: { score: number }[];
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isSelected,
  onClick,
  studentView = false,
  studentGrades = []
}) => {
  const averageGrade = studentView
    ? studentGrades.reduce((acc, grade) => acc + grade.score, 0)
    : course.students.reduce((acc, student) => acc + student.finalGrade, 0) / course.students.length;

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'bg-white border border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <GraduationCap className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">{course.name}</h3>
      </div>
      
      {!studentView && (
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Users className="w-4 h-4" />
          <span>{course.students.length} estudiantes</span>
        </div>
      )}
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {studentView ? 'Tu puntaje total:' : 'Promedio del curso:'}
        </p>
        <p className="text-2xl font-bold text-blue-600">
          {averageGrade.toFixed(1)}
        </p>
      </div>
    </div>
  );
};