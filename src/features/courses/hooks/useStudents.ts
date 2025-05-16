/**
 * Custom hook for student-related functionality
 *
 * Provides access to student operations and derived data
 */
import { useCourseStore } from "../store/courseStore";
import { CourseStudent } from "../types";
import { useCallback } from "react";

export const useStudents = (courseId?: string) => {
  const {
    courses,
    addStudent,
    deleteStudent,
    updateStudent,
    updateGrade,
    updatePerformanceMetrics,
  } = useCourseStore();

  // Find the course by ID
  const course = courseId ? courses.find((c) => c.id === courseId) : null;

  // Get all students for the course
  const students = useMemo(() => course?.students || [], [course]);

  // Get a student by ID
  const getStudentById = useCallback(
    (studentId: string): CourseStudent | undefined => {
      return students.find((student) => student.id === studentId);
    },
    [students]
  );

  // Add a new student to the course
  const handleAddStudent = useCallback(
    (student: { firstName: string; lastName: string; email: string }) => {
      if (courseId) {
        addStudent(courseId, student);
        return true;
      }
      return false;
    },
    [courseId, addStudent]
  );

  // Delete a student
  const handleDeleteStudent = useCallback(
    (studentId: string) => {
      if (courseId) {
        deleteStudent(courseId, studentId);
        return true;
      }
      return false;
    },
    [courseId, deleteStudent]
  );

  // Update student information
  const handleUpdateStudent = useCallback(
    (
      studentId: string,
      updates: Partial<{
        firstName: string;
        lastName: string;
        email: string;
      }>
    ) => {
      if (courseId) {
        updateStudent(courseId, studentId, updates);
        return true;
      }
      return false;
    },
    [courseId, updateStudent]
  );

  // Update a student's grade
  const handleUpdateGrade = useCallback(
    (studentId: string, gradeId: string, newScore: number) => {
      if (courseId) {
        updateGrade(courseId, studentId, gradeId, newScore);
        return true;
      }
      return false;
    },
    [courseId, updateGrade]
  );

  // Update student performance metrics
  const handleUpdatePerformanceMetrics = useCallback(
    (
      studentId: string,
      metrics: { attendance: number; participation: number }
    ) => {
      if (courseId) {
        updatePerformanceMetrics(courseId, studentId, metrics);
        return true;
      }
      return false;
    },
    [courseId, updatePerformanceMetrics]
  );

  // Get student grade average
  const getStudentAverage = useCallback(
    (studentId: string): number => {
      const student = getStudentById(studentId);
      if (!student || student.grades.length === 0) return 0;

      const totalScore = student.grades.reduce(
        (sum, grade) => sum + grade.score,
        0
      );
      return totalScore / student.grades.length;
    },
    [getStudentById]
  );

  return {
    students,
    getStudentById,
    addStudent: handleAddStudent,
    deleteStudent: handleDeleteStudent,
    updateStudent: handleUpdateStudent,
    updateGrade: handleUpdateGrade,
    updatePerformanceMetrics: handleUpdatePerformanceMetrics,
    getStudentAverage,
  };
};
