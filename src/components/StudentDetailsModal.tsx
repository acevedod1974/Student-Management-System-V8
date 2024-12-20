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
import { X } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Course, Student } from '../types/course';

interface StudentDetailsModalProps {
  student: Student;
  course: Course;
  onClose: () => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  course,
  onClose,
}) => {
  const data = student.grades.map((grade, index) => {
    const examAverage =
      course.students.reduce(
        (acc, s) => acc + s.grades[index].score,
        0
      ) / course.students.length;

    return {
      name: grade.examName,
      calificacion: grade.score,
      promedioCurso: Number(examAverage.toFixed(1)),
    };
  });

  const gradeRanges = [
    { name: '0-100', range: [0, 100], color: '#ef4444' },
    { name: '101-200', range: [101, 200], color: '#f97316' },
    { name: '201-300', range: [201, 300], color: '#eab308' },
    { name: '301-400', range: [301, 400], color: '#22c55e' },
    { name: '401-500', range: [401, 500], color: '#3b82f6' },
  ];

  const distributionData = gradeRanges.map((range) => ({
    name: `${range.name} pts`,
    value: course.students.filter(
      (s) =>
        s.finalGrade >= range.range[0] &&
        s.finalGrade < range.range[1]
    ).length,
    color: range.color,
  }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 relative">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {student.firstName} {student.lastName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total de Puntos</p>
              <p className={`text-3xl font-bold ${
                student.finalGrade >= 300 ? 'text-green-600' : 'text-red-600'
              }`}>
                {student.finalGrade}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Promedio del Curso</p>
              <p className="text-3xl font-bold text-blue-600">
                {(
                  course.students.reduce((acc, s) => acc + s.finalGrade, 0) /
                  course.students.length
                ).toFixed(1)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Calificaciones por Examen</h3>
              <div className="flex gap-4">
                {data.map((exam) => (
                  <div key={exam.name} className="min-w-[200px] bg-white p-4 rounded-lg shadow">
                    <h4 className="font-medium text-gray-900 mb-2">{exam.name}</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Calificación</p>
                        <p className="text-xl font-bold text-blue-600">{exam.calificacion}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Promedio del Curso</p>
                        <p className="text-lg text-gray-900">{exam.promedioCurso}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Diferencia</p>
                        <p className={`text-lg font-medium ${
                          exam.calificacion > exam.promedioCurso
                            ? 'text-green-600'
                            : exam.calificacion < exam.promedioCurso
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
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
            <div>
              <h3 className="text-lg font-semibold mb-4">Rendimiento por Examen</h3>
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
                      name="Calificación"
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

            <div>
              <h3 className="text-lg font-semibold mb-4">Distribución de Notas del Curso</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => 
                        percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
                      }
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Volver al Curso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};