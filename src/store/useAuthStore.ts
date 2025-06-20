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
  teacherPasswords: Record<string, string>;
  user: { email: string; role: string } | null;
  setStudentPasswords: (passwords: Record<string, string>) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  analyzePasswords: () => {
    missingPasswords: string[];
    repeatedPasswords: string[];
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      studentPasswords: {
        "jabonaldep@estudiante.unexpo.edu.ve": "A1b2C3d4E5",
        "fscolmenarezc@estudiante.unexpo.edu.ve": "F6g7H8i9J0",
        "jddefs@estudiante.unexpo.edu.ve": "K1l2M3n4O5",
        "cmespinozam@estudiante.unexpo.edu.ve": "P6q7R8s9T0",
        "sagomezc@estudiante.unexpo.edu.ve": "U1v2W3x4Y5",
        "pgrodriguezn@estudiante.unexpo.edu.ve": "Z6a7B8c9D0",
        "dasalazarb@estudiante.unexpo.edu.ve": "E1f2G3h4I5",
        "hayepezv@estudiante.unexpo.edu.ve": "J6k7L8m9N0",
        "rarodriguezr4@estudiante.unexpo.edu.ve": "O1p2Q3r4S5",
        "macamachob@estudiante.unexpo.edu.ve": "T6u7V8w9X0",
        "hjcamachom@estudiante.unexpo.edu.ve": "Y1z2A3b4C5",
        "gjfebresb@estudiante.unexpo.edu.ve": "D6e7F8g9H0",
        "eajimenezg@estudiante.unexpo.edu.ve": "I1j2K3l4M5",
      },
      teacherPasswords: {
        "dacevedo@unexpo.edu.ve": "lfsbyrt2",
      },
      user: null,
      setStudentPasswords: (passwords) => set({ studentPasswords: passwords }),
      login: (email, password) => {
        const { studentPasswords, teacherPasswords } = get();
        if (studentPasswords[email] === password) {
          set({ user: { email, role: "student" } });
          return true;
        } else if (teacherPasswords[email] === password) {
          set({ user: { email, role: "teacher" } });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
      analyzePasswords: () => {
        const { studentPasswords, teacherPasswords } = get();
        const allPasswords = { ...studentPasswords, ...teacherPasswords };
        const passwordValues = Object.values(allPasswords);
        const missingPasswords = Object.keys(allPasswords).filter(
          (email) => !allPasswords[email]
        );
        const repeatedPasswords = passwordValues.filter(
          (password, index, self) => self.indexOf(password) !== index
        );
        return { missingPasswords, repeatedPasswords };
      },
    }),
    {
      name: "auth-storage", // unique name for the storage
    }
  )
);
