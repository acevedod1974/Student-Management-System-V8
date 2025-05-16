/**
 * Course Store Module
 *
 * Central state management for courses, students, exams, and grades
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Course, CourseStore, CourseStudent, Grade } from "../types";

/**
 * Helper function to calculate the final grade from an array of grades
 */
const calculateFinalGrade = (grades: { score: number }[]): number => {
  return grades.reduce((acc, grade) => acc + grade.score, 0);
};

/**
 * Function to generate dummy data for development
 */
const generateDummyData = (): Course[] => {
  const exams = ["Examen 1", "Examen 2", "Examen 3", "Examen 4", "Examen 5"];

  const generateStudent = (index: number, prefix: string): CourseStudent => {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pf2",
      name: "PROCESOS DE FABRICACION 2",
      students: Array.from({ length: 5 }, (_, i) => generateStudent(i, "pf2")),
      exams,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

/**
 * Create the course store with persistence
 */
export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      // State
      courses: generateDummyData(),
      selectedCourse: null,
      isLoading: false,
      error: null,

      // Course actions
      setSelectedCourse: (courseId) => set({ selectedCourse: courseId }),

      // Student actions
      addStudent: (courseId, studentData) =>
        set((state) => {
          const course = state.courses.find((c) => c.id === courseId);
          if (!course) return state;

          const grades: Grade[] = course.exams.map((exam) => ({
            id: `grade-${crypto.randomUUID()}`,
            examName: exam,
            score: 0,
          }));

          const newStudent: CourseStudent = {
            id: crypto.randomUUID(),
            ...studentData,
            grades,
            finalGrade: 0,
          };

          return {
            courses: state.courses.map((c) =>
              c.id === courseId
                ? {
                    ...c,
                    students: [...c.students, newStudent],
                    updatedAt: new Date().toISOString(),
                  }
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
                  updatedAt: new Date().toISOString(),
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
                  updatedAt: new Date().toISOString(),
                }
              : course
          ),
        })),

      // Grade actions
      updateGrade: (courseId, studentId, gradeId, newScore) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  students: course.students.map((student) => {
                    if (student.id !== studentId) return student;

                    const updatedGrades = student.grades.map((grade) =>
                      grade.id === gradeId
                        ? { ...grade, score: newScore }
                        : grade
                    );

                    return {
                      ...student,
                      grades: updatedGrades,
                      finalGrade: calculateFinalGrade(updatedGrades),
                    };
                  }),
                  updatedAt: new Date().toISOString(),
                }
              : course
          ),
        })),

      // Exam actions
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
                  updatedAt: new Date().toISOString(),
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
                  updatedAt: new Date().toISOString(),
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
                  updatedAt: new Date().toISOString(),
                }
              : course
          ),
        })),

      // Data management actions
      exportData: () => {
        try {
          return JSON.stringify(get().courses, null, 2);
        } catch {
          set({ error: "Error exporting data" });
          return "[]";
        }
      },

      importData: (jsonData) => {
        set({ isLoading: true });
        try {
          const courses = JSON.parse(jsonData);
          if (Array.isArray(courses)) {
            set({
              courses,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error("Invalid data format");
          }
        } catch (error) {
          console.error("Error importing data:", error);
          set({
            error: "Error importing data: Invalid format",
            isLoading: false,
          });
        }
      },

      // Performance metrics actions
      updatePerformanceMetrics: (courseId, studentId, metrics) => {
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
                updatedAt: new Date().toISOString(),
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
