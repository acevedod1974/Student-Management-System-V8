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
  adminPasswords: Record<string, string>;
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
        "jabonaldep@estudiante.unexpo.edu.ve": "A1b2C3d4E5",
        "pvgomezm@estudiante.unexpo.edu.ve": "F6g7H8i9J0",
        "nrgonzalezd@estudiante.unexpo.edu.ve": "K1l2M3n4O5",
        "nclopezm@estudiante.unexpo.edu.ve": "P6q7R8s9T0",
        "ammarquezc@estudiante.unexpo.edu.ve": "U1v2W3x4Y5",
        "ajmatac@estudiante.unexpo.edu.ve": "Z6a7B8c9D0",
        "pjmejiasb@estudiante.unexpo.edu.ve": "E1f2G3h4I5",
        "avpulidoa@estudiante.unexpo.edu.ve": "J6k7L8m9N0",
        "rarodriguezr4@estudiante.unexpo.edu.ve": "O1p2Q3r4S5",
        "macamachob@estudiante.unexpo.edu.ve": "T6u7V8w9X0",
        "hjcamachom@estudiante.unexpo.edu.ve": "Y1z2A3b4C5",
        "gjfebresb@estudiante.unexpo.edu.ve": "D6e7F8g9H0",
        "eajimenezg@estudiante.unexpo.edu.ve": "I1j2K3l4M5",
      },
      teacherPasswords: {
        "dacevedo@unexpo.edu.ve": "lfsbyrt2",
      },
      adminPasswords: {
        "admin@unexpo.edu.ve": "2Lfsbyrt4.",
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
        const {
          studentPasswords,
          teacherPasswords,
          adminPasswords,
          loginEnabled,
        } = get();

        if (!loginEnabled && !adminPasswords[email]) {
          console.log("Logins are currently disabled.");
          return false;
        }

        if (adminPasswords[email] === password) {
          set({ user: { email, role: "admin" } });
          return true;
        } else if (teacherPasswords[email] === password) {
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
        const adminPasswords = get().adminPasswords;

        if (adminPasswords[email] === oldPassword) {
          set({
            adminPasswords: {
              ...adminPasswords,
              [email]: newPassword,
            },
          });
          return true;
        } else if (teacherPasswords[email] === oldPassword) {
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
