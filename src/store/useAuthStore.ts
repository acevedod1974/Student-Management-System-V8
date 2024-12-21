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
  loginEnabled: boolean;
  setLoginEnabled: (enabled: boolean) => void;
  setStudentPasswords: (passwords: Record<string, string>) => void;
  analyzePasswords: () => {
    missingPasswords: string[];
    repeatedPasswords: string[];
  };
  login: (email: string, password: string) => boolean;
  logout: () => void;
  changePassword: (
    email: string,
    oldPassword: string,
    newPassword: string
  ) => boolean;
  // other state and actions...
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      studentPasswords: {
        "jabonaldep@estudiante.unexpo.edu.ve": "student123",
        "pvgomezm@estudiante.unexpo.edu.ve": "student123",
        "nrgonzalezd@estudiante.unexpo.edu.ve": "student123",
        "nclopezm@estudiante.unexpo.edu.ve": "student123",
        "ammarquezc@estudiante.unexpo.edu.ve": "student123",
        "ajmatac@estudiante.unexpo.edu.ve": "student123",
        "pjmejiasb@estudiante.unexpo.edu.ve": "student123",
        "avpulidoa@estudiante.unexpo.edu.ve": "student123",
        "rarodriguezr4@estudiante.unexpo.edu.ve": "student123",
        "macamachob@estudiante.unexpo.edu.ve": "student123",
        "hjcamachom@estudiante.unexpo.edu.ve": "student123",
        "gjfebresb@estudiante.unexpo.edu.ve": "student123",
        "eajimenezg@estudiante.unexpo.edu.ve": "student123",
      },
      teacherPasswords: {
        "dacevedo@unexpo.edu.ve": "lfsbyrt2",
      },
      loginEnabled: true,
      setLoginEnabled: (enabled) => set({ loginEnabled: enabled }),
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
        const { studentPasswords, teacherPasswords, loginEnabled } = get();

        if (!loginEnabled) {
          console.log("Logins are currently disabled.");
          return false;
        }

        if (teacherPasswords[email] === password) {
          set({ user: { email, role: "teacher" } });
          return true;
        } else if (studentPasswords[email] === password) {
          set({ user: { email, role: "student" } });
          return true;
        }

        return false;
      },
      logout: () => {
        set({ user: null });
      },
      changePassword: (email, oldPassword, newPassword) => {
        const studentPasswords = get().studentPasswords;
        const teacherPasswords = get().teacherPasswords;

        if (teacherPasswords[email] === oldPassword) {
          set({
            teacherPasswords: {
              ...teacherPasswords,
              [email]: newPassword,
            },
          });
          return true;
        } else if (studentPasswords[email] === oldPassword) {
          set({
            studentPasswords: {
              ...studentPasswords,
              [email]: newPassword,
            },
          });
          return true;
        }

        return false;
      },
      // other state and actions...
    }),
    {
      name: "auth-storage", // unique name for the storage
    }
  )
);
