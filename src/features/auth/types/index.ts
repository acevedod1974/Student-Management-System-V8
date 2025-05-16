/**
 * Authentication related type definitions
 */

/**
 * Represents a user in the authentication system
 */
export interface User {
  email: string;
  role: "student" | "teacher";
}

/**
 * Password record structure
 */
export type PasswordRecord = Record<string, string>;

/**
 * Password analysis result structure
 */
export interface PasswordAnalysisResult {
  missingPasswords: string[];
  repeatedPasswords: string[];
}

/**
 * Authentication state structure
 */
export interface AuthState {
  studentPasswords: PasswordRecord;
  teacherPasswords: PasswordRecord;
  user: User | null;
  isAuthenticated: boolean;
}

/**
 * Authentication actions structure
 */
export interface AuthActions {
  setStudentPasswords: (passwords: PasswordRecord) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  analyzePasswords: () => PasswordAnalysisResult;
}

/**
 * Complete auth store type
 */
export type AuthStore = AuthState & AuthActions;
