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
import { Home, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export const Navigation: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHomeClick = () => {
    if (user) {
      if (user.role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={handleHomeClick}
              className="flex items-center px-4 hover:text-blue-600"
            >
              <Home className="w-5 h-5" />
              <span className="ml-2">Inicio</span>
            </button>
          </div>
          {user && (
            <div className="flex items-center">
              <span className="mr-4">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
