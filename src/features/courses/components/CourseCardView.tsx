/**
 * Course Card View Component
 *
 * Presentation component that displays course information in a card format
 */
import React from "react";
import { Users, GraduationCap } from "lucide-react";

export interface CourseCardViewProps {
  name: string;
  studentCount: number;
  averageGrade: number;
  isSelected: boolean;
  onClick: () => void;
  studentView?: boolean;
}

export const CourseCardView: React.FC<CourseCardViewProps> = ({
  name,
  studentCount,
  averageGrade,
  isSelected,
  onClick,
  studentView = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "bg-blue-50 border-2 border-blue-500"
          : "bg-white border border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <GraduationCap className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>

      {!studentView && (
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Users className="w-4 h-4" />
          <span>{studentCount} estudiantes</span>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {studentView ? "Tu puntaje total:" : "Promedio del curso:"}
        </p>
        <p className="text-2xl font-bold text-blue-600">
          {averageGrade.toFixed(1)}
        </p>
      </div>
    </div>
  );
};
