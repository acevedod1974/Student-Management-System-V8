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

import { create } from "zustand";
import { api } from "../services/api";
import { Course } from "../types";

interface CourseStore {
  courses: Course[];
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  fetchCourses: () => Promise<void>;
  getCourse: (id: string) => Promise<Course>;
  createCourse: (course: Omit<Course, "id">) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  loading: false,
  error: null,
  setError: (error) => set({ error }),

  fetchCourses: async () => {
    try {
      set({ loading: true, error: null });
      const courses = await api.courses.getAll();
      set({ courses, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch courses",
        loading: false,
      });
    }
  },

  getCourse: async (id) => {
    try {
      set({ loading: true, error: null });
      const course = await api.courses.getById(id);
      if (!course) throw new Error("Course not found");
      return course;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch course",
        loading: false,
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createCourse: async (courseData) => {
    try {
      set({ loading: true, error: null });
      const course = await api.courses.create(courseData);
      set((state) => ({
        courses: [...state.courses, course],
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create course",
        loading: false,
      });
      throw error;
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      set({ loading: true, error: null });
      const updatedCourse = await api.courses.update(id, courseData);
      set((state) => ({
        courses: state.courses.map((c) => (c.id === id ? updatedCourse : c)),
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update course",
        loading: false,
      });
      throw error;
    }
  },
}));
