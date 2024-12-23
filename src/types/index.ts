export interface Student {
  id: string;
  email: string;
  name: string;
  finalGrade: number;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  students: Student[];
  courseAverage?: number;
}

export type BackupVersion = "1.0";

export interface Backup {
  courses: Course[];
  studentPasswords: Record<string, string>;
  version: BackupVersion;
  timestamp?: string;
}
