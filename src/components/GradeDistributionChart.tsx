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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Course } from '../types/course';

interface GradeDistributionChartProps {
  course: Course;
}

export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({ course }) => {
  const gradeRanges = [
    { name: '0-100', range: [0, 100], color: '#ef4444' },
    { name: '101-200', range: [101, 200], color: '#f97316' },
    { name: '201-300', range: [201, 300], color: '#eab308' },
    { name: '301-400', range: [301, 400], color: '#22c55e' },
    { name: '401-500', range: [401, 500], color: '#3b82f6' },
  ];

  const data = gradeRanges.map((range) => ({
    name: `${range.name} pts`,
    value: course.students.filter(
      (student) =>
        student.finalGrade >= range.range[0] &&
        student.finalGrade < range.range[1]
    ).length,
    color: range.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => 
            percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
          }
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};