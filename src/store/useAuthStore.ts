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
  studentPasswords: Record<string, string>;
  setStudentPasswords: (passwords: Record<string, string>) => void;
  analyzePasswords: () => void;
  // other state and actions...
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      studentPasswords: {},
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

        console.log("Missing Passwords:", missingPasswords);
        console.log("Repeated Passwords:", repeatedPasswords);
      },
      // other state and actions...
    }),
    {
      name: "auth-storage", // unique name for the storage
    }
  )
);
