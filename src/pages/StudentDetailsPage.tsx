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
import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from "recharts";
import { useCourseStore } from "../store/useCourseStore";
import { useAuthStore } from "../store/useAuthStore";
import { PerformanceMetricsEditor } from "../components/PerformanceMetricsEditor"; // Import the editor

export const StudentDetailsPage: React.FC = () => {
  const { courseId, studentId } = useParams();
  const courses = useCourseStore((state) => state.courses);
  const { user } = useAuthStore();
  const [showMetricsEditor, setShowMetricsEditor] = useState(false); // State for showing the editor

  const course = courses.find((c) => c.id === courseId);
  type Student = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    grades: { examName: string; score: number }[];
    finalGrade: number;
    performanceMetrics?: {
      attendance: number;
      participation: number;
    };
  };

  const student: Student | undefined = course?.students.find(
    (s) => s.id === studentId
  );

  if (!course || !student) {
    return <Navigate to="/" replace />;
  }

  // Check if the logged-in student is trying to access their own grades
  if (user?.role === "student" && user.email !== student.email) {
    return <Navigate to="/" replace />;
  }

  const data = student.grades.map((grade, index) => {
    const examAverage =
      course.students.reduce((acc, s) => acc + s.grades[index].score, 0) /
      course.students.length;

    return {
      name: grade.examName,
      calificacion: grade.score,
      promedioCurso: Number(examAverage.toFixed(1)),
    };
  });

  // Calculate class ranking data
  const rankingData = course.students
    .map((s) => ({
      name: `${s.firstName} ${s.lastName}`,
      puntaje: s.finalGrade,
      isCurrentStudent: s.id === student.id,
    }))
    .sort((a, b) => b.puntaje - a.puntaje);

  // Calculate performance metrics for radar chart
  const performanceData = [
    {
      subject: "Promedio",
      score:
        student.grades.reduce((acc, grade) => acc + grade.score, 0) /
        student.grades.length,
      fullMark: 100,
    },
    {
      subject: "Máxima Nota",
      score: Math.max(...student.grades.map((g) => g.score)),
      fullMark: 100,
    },
    {
      subject: "Mínima Nota",
      score: Math.min(...student.grades.map((g) => g.score)),
      fullMark: 100,
    },
    {
      subject: "Asistencia",
      score: student.performanceMetrics?.attendance || 0,
      fullMark: 100,
    },
    {
      subject: "Participación",
      score: student.performanceMetrics?.participation || 0,
      fullMark: 100,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to={user?.role === "teacher" ? `/course/${courseId}` : "/"}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-gray-600">{course.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total de Puntos</p>
          <p
            className={`text-3xl font-bold ${
              student.finalGrade >= 250 ? "text-green-600" : "text-red-600"
            }`}
          >
            {student.finalGrade}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Promedio del Curso</p>
          <p className="text-3xl font-bold text-blue-600">
            {(
              course.students.reduce((acc, s) => acc + s.finalGrade, 0) /
              course.students.length
            ).toFixed(1)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Calificaciones por Examen
        </h3>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {data.map((exam) => (
              <div
                key={exam.name}
                className="min-w-[200px] bg-gray-50 p-4 rounded-lg"
              >
                <h4 className="font-medium text-gray-900 mb-2">{exam.name}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Calificación</p>
                    <p className="text-xl font-bold text-blue-600">
                      {exam.calificacion}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Promedio del Curso</p>
                    <p className="text-lg text-gray-900">
                      {exam.promedioCurso}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diferencia</p>
                    <p
                      className={`text-lg font-medium ${
                        exam.calificacion > exam.promedioCurso
                          ? "text-green-600"
                          : exam.calificacion < exam.promedioCurso
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {(exam.calificacion - exam.promedioCurso).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Progreso en el Curso</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="calificacion"
                  name="Tu Calificación"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="promedioCurso"
                  name="Promedio del Curso"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Análisis de Rendimiento
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={performanceData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Rendimiento"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Posición en el Curso</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rankingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="puntaje" name="Puntaje Total">
                {rankingData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCurrentStudent ? "#3b82f6" : "#94a3b8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {user?.role === "teacher" && ( // Conditionally render the button for teachers only
        <button
          onClick={() => setShowMetricsEditor(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Editar Métricas de Rendimiento
        </button>
      )}

      {showMetricsEditor && (
        <PerformanceMetricsEditor
          courseId={course.id}
          studentId={student.id}
          currentMetrics={
            student.performanceMetrics || { attendance: 0, participation: 0 }
          }
          onClose={() => setShowMetricsEditor(false)}
        />
      )}
    </div>
  );
};
