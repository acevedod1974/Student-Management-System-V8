/**
 * Custom hook for exam-related functionality within courses
 *
 * Provides operations for managing exams and related analytics
 */
import { useCallback, useMemo } from "react";
import { useCourseStore } from "../store/courseStore";

export const useExams = (courseId?: string) => {
  const { courses, addExam, deleteExam, updateExamName } = useCourseStore();

  // Find the course by ID
  const course = courseId ? courses.find((c) => c.id === courseId) : null;

  // Get all exams for the course
  const exams = course?.exams || [];

  // Add a new exam to the course
  const handleAddExam = useCallback(
    (examName: string) => {
      if (courseId) {
        addExam(courseId, examName);
        return true;
      }
      return false;
    },
    [courseId, addExam]
  );

  // Delete an exam from the course
  const handleDeleteExam = useCallback(
    (examIndex: number) => {
      if (courseId) {
        deleteExam(courseId, examIndex);
        return true;
      }
      return false;
    },
    [courseId, deleteExam]
  );

  // Update an exam name
  const handleUpdateExamName = useCallback(
    (examIndex: number, newName: string) => {
      if (courseId) {
        updateExamName(courseId, examIndex, newName);
        return true;
      }
      return false;
    },
    [courseId, updateExamName]
  );

  // Calculate exam statistics
  const examStatistics = useMemo(() => {
    if (!course) return [];

    return course.exams.map((examName, examIndex) => {
      const scores = course.students.map(
        (student) => student.grades[examIndex]?.score || 0
      );

      const total = scores.length;
      const average =
        total > 0 ? scores.reduce((sum, score) => sum + score, 0) / total : 0;

      const min = total > 0 ? Math.min(...scores) : 0;

      const max = total > 0 ? Math.max(...scores) : 0;

      const passing = scores.filter((score) => score >= 60).length;
      const passingRate = total > 0 ? (passing / total) * 100 : 0;

      return {
        name: examName,
        index: examIndex,
        average,
        min,
        max,
        passing,
        total,
        passingRate,
      };
    });
  }, [course]);

  return {
    exams,
    addExam: handleAddExam,
    deleteExam: handleDeleteExam,
    updateExamName: handleUpdateExamName,
    examStatistics,
  };
};
