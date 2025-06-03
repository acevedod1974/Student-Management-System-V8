/**
 * Course Card Container Component
 *
 * Container component that handles data preparation for course card display
 */
import React, { useMemo } from "react";
import { CourseCardView } from "./CourseCardView";
import { Course } from "../types";

export interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onClick: () => void;
  studentView?: boolean;
  studentGrades?: { score: number }[];
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isSelected,
  onClick,
  studentView = false,
  studentGrades = [],
}) => {
  // Calculate average grade based on view type
  const averageGrade = useMemo(() => {
    if (studentView) {
      return studentGrades.reduce((acc, grade) => acc + grade.score, 0);
    } else {
      return course.students.length > 0
        ? course.students.reduce(
            (acc, student) => acc + student.finalGrade,
            0
          ) / course.students.length
        : 0;
    }
  }, [course, studentView, studentGrades]);

  return (
    <CourseCardView
      name={course.name}
      studentCount={course.students.length}
      averageGrade={averageGrade}
      isSelected={isSelected}
      onClick={onClick}
      studentView={studentView}
    />
  );
};

export default CourseCard;
