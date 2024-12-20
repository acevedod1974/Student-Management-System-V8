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
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Home, LogOut } from 'lucide-react';
import { useCourseStore } from '../store/useCourseStore';
import { useAuthStore } from '../store/useAuthStore';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const courses = useCourseStore((state) => state.courses);
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Inicio</span>
            </Link>
            {user?.role === 'teacher' && (
              <>
                <div className="h-6 w-px bg-gray-200" />
                <div className="flex gap-4">
                  {courses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/course/${course.id}`}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === `/course/${course.id}`
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {course.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </nav>
    </header>
  );
};