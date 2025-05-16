/**
 * Course feature type definitions
 */

/**
 * Represents a grade for a student's exam
 */
export interface Grade {
  id: string;
  examName: string;
  score: number;
}

/**
 * Represents a student in a course
 */
export interface CourseStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grades: Grade[];
  finalGrade: number;
  performanceMetrics?: {
    attendance: number;
    participation: number;
  };
}

/**
 * Represents a course entity
 */
export interface Course {
  id: string;
  name: string;
  students: CourseStudent[];
  exams: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Course state
 */
export interface CourseState {
  courses: Course[];
  selectedCourse: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Course actions
 */
export interface CourseActions {
  // Course actions
  setSelectedCourse: (courseId: string | null) => void;

  // Student actions
  addStudent: (
    courseId: string,
    student: Omit<CourseStudent, "id" | "grades" | "finalGrade">
  ) => void;
  deleteStudent: (courseId: string, studentId: string) => void;
  updateStudent: (
    courseId: string,
    studentId: string,
    updates: Partial<Omit<CourseStudent, "id" | "grades" | "finalGrade">>
  ) => void;

  // Grade actions
  updateGrade: (
    courseId: string,
    studentId: string,
    gradeId: string,
    newScore: number
  ) => void;

  // Exam actions
  updateExamName: (
    courseId: string,
    examIndex: number,
    newName: string
  ) => void;
  addExam: (courseId: string, examName: string) => void;
  deleteExam: (courseId: string, examIndex: number) => void;

  // Data management actions
  exportData: () => string;
  importData: (data: string) => void;

  // Performance metrics actions
  updatePerformanceMetrics: (
    courseId: string,
    studentId: string,
    metrics: { attendance: number; participation: number }
  ) => void;
}

/**
 * Complete course store type
 */
export type CourseStore = CourseState & CourseActions;
