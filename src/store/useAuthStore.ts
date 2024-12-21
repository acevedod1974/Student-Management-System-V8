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

import create from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: { email: string; role: string } | null;
  studentPasswords: Record<string, string>;
  teacherPasswords: Record<string, string>;
  setStudentPasswords: (passwords: Record<string, string>) => void;
  analyzePasswords: () => {
    missingPasswords: string[];
    repeatedPasswords: string[];
  };
  login: (email: string, password: string) => boolean;
  logout: () => void;
  // other state and actions...
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      studentPasswords: {
        "macamachob@estudiante.unexpo.edu.ve": "student123",
        "hjcamachom@estudiante.unexpo.edu.ve": "student123",
        "gjfebresb@estudiante.unexpo.edu.ve": "student123",
        "eajimenezg@estudiante.unexpo.edu.ve": "student123",
      },
      teacherPasswords: {
        "dacevedo@unexpo.edu.ve": "lfsbyrt2",
      },
      setStudentPasswords: (passwords) => set({ studentPasswords: passwords }),
      analyzePasswords: () => {
        const passwords = get().studentPasswords;
        const passwordValues = Object.values(passwords);
        const missingPasswords = Object.keys(passwords).filter(
          (key) => !passwords[key]
        );
        const repeatedPasswords = passwordValues.filter(
          (password, index, self) => self.indexOf(password) !== index
        );

        return { missingPasswords, repeatedPasswords };
      },
      login: (email, password) => {
        const studentPasswords = get().studentPasswords;
        const teacherPasswords = get().teacherPasswords;
        console.log("Attempting login with email:", email); // Debugging line
        console.log("Stored student passwords:", studentPasswords); // Debugging line
        console.log("Stored teacher passwords:", teacherPasswords); // Debugging line

        if (teacherPasswords[email] === password) {
          set({ user: { email, role: "teacher" } });
          console.log("Login successful for teacher email:", email); // Debugging line
          return true;
        } else if (studentPasswords[email] === password) {
          set({ user: { email, role: "student" } });
          console.log("Login successful for student email:", email); // Debugging line
          return true;
        }

        console.log("Login failed for email:", email); // Debugging line
        return false;
      },
      logout: () => {
        set({ user: null });
      },
      // other state and actions...
    }),
    {
      name: "auth-storage", // unique name for the storage
    }
  )
);
