/**
 * Custom hook for course-related functionality
 *
 * Provides access to course data and operations with additional derived state
 */
import { useMemo } from "react";
import { useCourseStore } from "../store/courseStore";
import { Course } from "../types";

export const useCourses = () => {
  const {
    courses,
    selectedCourse: selectedCourseId,
    setSelectedCourse,
    isLoading,
    error,
    exportData,
    importData,
  } = useCourseStore();

  // Derived state - the currently selected course
  const selectedCourse = useMemo(() => {
    return courses.find((course) => course.id === selectedCourseId) || null;
  }, [courses, selectedCourseId]);

  // Get course by ID
  const getCourseById = (courseId: string): Course | undefined => {
    return courses.find((course) => course.id === courseId);
  };

  // Calculate the course average
  const calculateCourseAverage = (courseId: string): number => {
    const course = getCourseById(courseId);
    if (!course || course.students.length === 0) return 0;

    const totalGrade = course.students.reduce(
      (acc, student) => acc + student.finalGrade,
      0
    );
    return totalGrade / course.students.length;
  };

  // Calculate passing rate
  const calculatePassingRate = (
    courseId: string,
    threshold = 250
  ): { passing: number; total: number; rate: number } => {
    const course = getCourseById(courseId);
    if (!course || course.students.length === 0) {
      return { passing: 0, total: 0, rate: 0 };
    }

    const total = course.students.length;
    const passing = course.students.filter(
      (student) => student.finalGrade >= threshold
    ).length;

    return {
      passing,
      total,
      rate: (passing / total) * 100,
    };
  };

  return {
    courses,
    selectedCourse,
    selectedCourseId,
    setSelectedCourse,
    getCourseById,
    calculateCourseAverage,
    calculatePassingRate,
    isLoading,
    error,
    exportData,
    importData,
  };
};
