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

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: Array<{
    date: string;
    averageGrade: number;
    attendance: number;
  }>;
}

function CourseOverviewChart({ data }: Props) {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString(),
    }));
  }, [data]);

  const metrics = useMemo(() => {
    if (data.length === 0) return { avgGrade: 0, trend: 'stable' };

    const avgGrade = data.reduce((sum, item) => sum + item.averageGrade, 0) / data.length;
    const trend = data[data.length - 1].averageGrade > avgGrade ? 'improving' : 'declining';

    return { avgGrade, trend };
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Course Performance Overview</h3>
        <p className="text-sm text-gray-600">
          Average Grade: {metrics.avgGrade.toFixed(2)} | Trend: {metrics.trend}
        </p>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="averageGrade"
              stroke="#4f46e5"
              name="Average Grade"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="attendance"
              stroke="#10b981"
              name="Attendance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default React.memo(CourseOverviewChart);