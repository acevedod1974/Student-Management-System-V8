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
import { persist } from "zustand/middleware";
import { Course, Student } from "../types/course";

interface CourseStore {
  courses: Course[];
  selectedCourse: string | null;
  setSelectedCourse: (courseId: string | null) => void;
  addStudent: (
    courseId: string,
    student: Omit<Student, "id" | "grades" | "finalGrade">
  ) => void;
  deleteStudent: (courseId: string, studentId: string) => void;
  updateGrade: (
    courseId: string,
    studentId: string,
    gradeId: string,
    newScore: number
  ) => void;
  updateStudent: (
    courseId: string,
    studentId: string,
    updates: Partial<Omit<Student, "id" | "grades" | "finalGrade">>
  ) => void;
  updateExamName: (
    courseId: string,
    examIndex: number,
    newName: string
  ) => void;
  addExam: (courseId: string, examName: string) => void;
  deleteExam: (courseId: string, examIndex: number) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
  updatePerformanceMetrics: (
    courseId: string,
    studentId: string,
    metrics: { attendance: number; participation: number }
  ) => void;
}

const calculateFinalGrade = (grades: { score: number }[]): number => {
  return grades.reduce((acc, grade) => acc + grade.score, 0);
};

const generateDummyData = (): Course[] => {
  const exams = ["Examen 1", "Examen 2", "Examen 3", "Examen 4", "Examen 5"];

  const generateStudent = (index: number, prefix: string) => {
    const grades = exams.map((exam, i) => ({
      id: `grade-${i}`,
      examName: exam,
      score: Math.floor(Math.random() * 100),
    }));

    return {
      id: `${prefix}-student-${index + 1}`,
      firstName: ["Juan", "María", "Carlos", "Ana", "Pedro"][index],
      lastName: ["García", "Rodríguez", "Martínez", "López", "González"][index],
      email: `student${index + 1}@universidad.edu`,
      grades,
      finalGrade: calculateFinalGrade(grades),
    };
  };

  return [
    {
      id: "pf1",
      name: "PROCESOS DE FABRICACION 1",
      students: Array.from({ length: 5 }, (_, i) => generateStudent(i, "pf1")),
      exams,
    },
    {
      id: "pf2",
      name: "PROCESOS DE FABRICACION 2",
      students: Array.from({ length: 5 }, (_, i) => generateStudent(i, "pf2")),
      exams,
    },
  ];
};

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: generateDummyData(),
      selectedCourse: null,
      setSelectedCourse: (courseId) => set({ selectedCourse: courseId }),
      addStudent: (courseId, studentData) =>
        set((state) => {
          const course = state.courses.find((c) => c.id === courseId);
          if (!course) return state;

          const grades = course.exams.map((exam) => ({
            id: `grade-${crypto.randomUUID()}`,
            examName: exam,
            score: 0,
          }));

          const newStudent: Student = {
            id: crypto.randomUUID(),
            ...studentData,
            grades,
            finalGrade: 0,
          };

          return {
            courses: state.courses.map((c) =>
              c.id === courseId
                ? { ...c, students: [...c.students, newStudent] }
                : c
            ),
          };
        }),
      deleteStudent: (courseId, studentId) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  students: course.students.filter((s) => s.id !== studentId),
                }
              : course
          ),
        })),
      updateGrade: (courseId, studentId, gradeId, newScore) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  students: course.students.map((student) =>
                    student.id === studentId
                      ? {
                          ...student,
                          grades: student.grades.map((grade) =>
                            grade.id === gradeId
                              ? { ...grade, score: newScore }
                              : grade
                          ),
                          finalGrade: calculateFinalGrade(
                            student.grades.map((grade) =>
                              grade.id === gradeId
                                ? { ...grade, score: newScore }
                                : grade
                            )
                          ),
                        }
                      : student
                  ),
                }
              : course
          ),
        })),
      updateStudent: (courseId, studentId, updates) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  students: course.students.map((student) =>
                    student.id === studentId
                      ? { ...student, ...updates }
                      : student
                  ),
                }
              : course
          ),
        })),
      updateExamName: (courseId, examIndex, newName) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  exams: course.exams.map((exam, index) =>
                    index === examIndex ? newName : exam
                  ),
                  students: course.students.map((student) => ({
                    ...student,
                    grades: student.grades.map((grade, index) =>
                      index === examIndex
                        ? { ...grade, examName: newName }
                        : grade
                    ),
                  })),
                }
              : course
          ),
        })),
      addExam: (courseId, examName) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  exams: [...course.exams, examName],
                  students: course.students.map((student) => ({
                    ...student,
                    grades: [
                      ...student.grades,
                      {
                        id: `grade-${crypto.randomUUID()}`,
                        examName,
                        score: 0,
                      },
                    ],
                    finalGrade: student.finalGrade,
                  })),
                }
              : course
          ),
        })),
      deleteExam: (courseId, examIndex) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  exams: course.exams.filter((_, index) => index !== examIndex),
                  students: course.students.map((student) => {
                    const newGrades = student.grades.filter(
                      (_, index) => index !== examIndex
                    );
                    return {
                      ...student,
                      grades: newGrades,
                      finalGrade: calculateFinalGrade(newGrades),
                    };
                  }),
                }
              : course
          ),
        })),
      exportData: () => JSON.stringify(get().courses, null, 2),
      importData: (jsonData) => {
        try {
          const courses = JSON.parse(jsonData);
          if (Array.isArray(courses)) {
            set({ courses });
          }
        } catch (error) {
          console.error("Error importing data:", error);
        }
      },
      updatePerformanceMetrics: (
        courseId: string,
        studentId: string,
        metrics: { attendance: number; participation: number }
      ) => {
        set((state) => ({
          courses: state.courses.map((course) => {
            if (course.id === courseId) {
              return {
                ...course,
                students: course.students.map((student) => {
                  if (student.id === studentId) {
                    return {
                      ...student,
                      performanceMetrics: metrics,
                    };
                  }
                  return student;
                }),
              };
            }
            return course;
          }),
        }));
      },
    }),
    {
      name: "course-storage",
    }
  )
);
