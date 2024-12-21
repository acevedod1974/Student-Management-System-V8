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

import React from "react";
import { useNavigate } from "react-router-dom";
import { useCourseStore } from "../store/useCourseStore";
import { useAuthStore } from "../store/useAuthStore";
import PasswordAnalysis from "../components/PasswordAnalysis";
import { CourseOverviewChart } from "../components/CourseOverviewChart";

export const Dashboard: React.FC = () => {
  const { courses } = useCourseStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userCourses =
    user?.role === "student"
      ? courses.filter((course) => course.students.includes(user.email))
      : courses;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Comparación de Cursos</h2>
          <CourseOverviewChart courses={userCourses} />
        </div>
        {user?.role === "teacher" && (
          <div className="mt-6">
            <PasswordAnalysis />
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Current User Information</h2>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Courses</h2>
          <div className="flex gap-4">
            {userCourses.map((course) => (
              <a
                key={course.id}
                href={`/course/${course.id}`}
                className="px-3 py-2 rounded-md text-lg font-medium text-blue-600 hover:underline"
              >
                {course.name}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
