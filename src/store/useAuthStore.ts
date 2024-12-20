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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  email: string;
  role: 'student' | 'teacher';
  studentId?: string;
}

interface AuthStore {
  user: User | null;
  studentPasswords: Record<string, string>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (email: string, oldPassword: string, newPassword: string) => boolean;
  isAuthenticated: boolean;
}

const TEACHER_CREDENTIALS = {
  email: 'dacevedo@unexpo.edu.ve',
  password: 'lfsbyrt2'
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      studentPasswords: {},
      login: async (email: string, password: string) => {
        // Teacher login
        if (email === TEACHER_CREDENTIALS.email) {
          if (password === TEACHER_CREDENTIALS.password) {
            set({
              user: { email, role: 'teacher' },
              isAuthenticated: true,
            });
            Cookies.set('userRole', 'teacher');
            return true;
          }
          return false;
        }
        
        // Student login
        const { studentPasswords } = get();
        if (studentPasswords[email] && studentPasswords[email] === password) {
          set({
            user: {
              email,
              role: 'student',
              studentId: email
            },
            isAuthenticated: true,
          });
          Cookies.set('userRole', 'student');
          return true;
        } else if (!studentPasswords[email] && password === 'student123') {
          // First-time login with default password
          set((state) => ({
            user: {
              email,
              role: 'student',
              studentId: email
            },
            isAuthenticated: true,
            studentPasswords: {
              ...state.studentPasswords,
              [email]: password
            }
          }));
          Cookies.set('userRole', 'student');
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        Cookies.remove('userRole');
      },
      changePassword: (email: string, oldPassword: string, newPassword: string) => {
        const { studentPasswords } = get();
        if (studentPasswords[email] === oldPassword || oldPassword === 'student123') {
          set((state) => ({
            studentPasswords: {
              ...state.studentPasswords,
              [email]: newPassword
            }
          }));
          return true;
        }
        return false;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);