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
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { CourseOverviewChart } from "../components/CourseOverviewChart";
import { useCourseStore } from "../store/useCourseStore";
import { useAuthStore } from "../store/useAuthStore";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export const Dashboard: React.FC = () => {
  const courses = useCourseStore((state) => state.courses);
  const { user } = useAuthStore();
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (user?.role === "student") {
    const studentCourses = courses.filter((course) =>
      course.students.some((student) => student.email === user.email)
    );

    const gradeData = studentCourses.map((course) => {
      const student = course.students.find((s) => s.email === user.email)!;
      return {
        name: course.name,
        puntaje: student.finalGrade,
        promedio:
          course.students.reduce((acc, s) => acc + s.finalGrade, 0) /
          course.students.length,
      };
    });

    const examProgressData = studentCourses.flatMap((course) => {
      const student = course.students.find((s) => s.email === user.email)!;
      return student.grades.map((grade) => ({
        name: `${course.name} - ${grade.examName}`,
        calificacion: grade.score,
      }));
    });

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
          <button
            onClick={() => setShowChangePassword(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Cambiar Contraseña
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentCourses.map((course) => {
            const student = course.students.find(
              (s) => s.email === user.email
            )!;
            return (
              <Link
                key={course.id}
                to={`/course/${course.id}/student/${student.id}`}
              >
                <CourseCard
                  course={course}
                  isSelected={false}
                  onClick={() => {}}
                  studentView
                  studentGrades={student.grades}
                />
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Comparación de Puntajes
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="puntaje" name="Tu Puntaje" fill="#3b82f6" />
                  <Bar
                    dataKey="promedio"
                    name="Promedio del Curso"
                    fill="#10b981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Progreso por Examen</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={examProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="calificacion"
                    name="Calificación"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {showChangePassword && (
          <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Vista General</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Link key={course.id} to={`/course/${course.id}`}>
            <CourseCard course={course} isSelected={false} onClick={() => {}} />
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Comparación de Cursos</h2>
        <CourseOverviewChart courses={courses} />
      </div>
    </div>
  );
};
