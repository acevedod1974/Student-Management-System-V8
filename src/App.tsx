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

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./pages/Dashboard";
import { CoursePage } from "./pages/CoursePage";
import { StudentDetailsPage } from "./pages/StudentDetailsPage";
import { LoginPage } from "./components/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {user && <Navigation />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <PrivateRoute allowedRoles={["teacher"]}>
                  <CoursePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:courseId/student/:studentId"
              element={
                <PrivateRoute>
                  <StudentDetailsPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
