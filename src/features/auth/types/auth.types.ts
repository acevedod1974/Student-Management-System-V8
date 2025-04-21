/**
 * Authentication Types
 */

export interface User {
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordAnalysisResult {
  missingPasswords: string[];
  repeatedPasswords: string[];
}
