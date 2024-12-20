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
import { Student } from '../types/student';

interface StudentStore {
  students: Student[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  students: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '1999-05-15',
      grade: 'Senior',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
      major: 'Computer Science',
      gpa: 3.8,
      enrollmentDate: '2020-09-01',
      status: 'active'
    },
    // Add more sample students here
  ],
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, { ...student, id: crypto.randomUUID() }]
    })),
  updateStudent: (id, updatedStudent) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id ? { ...student, ...updatedStudent } : student
      )
    })),
  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((student) => student.id !== id)
    }))
}));