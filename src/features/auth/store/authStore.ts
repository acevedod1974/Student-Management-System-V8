/**
 * Authentication store module
 *
 * Handles user authentication, password management, and session state
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthStore, PasswordRecord, User } from "../types";

/**
 * Initial passwords for testing/development
 */
const initialStudentPasswords: PasswordRecord = {
  "jabonaldep@estudiante.unexpo.edu.ve": "A1b2C3d4E5",
  "pvgomezm@estudiante.unexpo.edu.ve": "F6g7H8i9J0",
  "nrgonzalezd@estudiante.unexpo.edu.ve": "K1l2M3n4O5",
  "nclopezm@estudiante.unexpo.edu.ve": "P6q7R8s9T0",
  "ammarquezc@estudiante.unexpo.edu.ve": "U1v2W3x4Y5",
  "ajmatac@estudiante.unexpo.edu.ve": "Z6a7B8c9D0",
  "pjmejiasb@estudiante.unexpo.edu.ve": "E1f2G3h4I5",
  "avpulidoa@estudiante.unexpo.edu.ve": "J6k7L8m9N0",
  "rarodriguezr4@estudiante.unexpo.edu.ve": "O1p2Q3r4S5",
  "macamachob@estudiante.unexpo.edu.ve": "T6u7V8w9X0",
  "hjcamachom@estudiante.unexpo.edu.ve": "Y1z2A3b4C5",
  "gjfebresb@estudiante.unexpo.edu.ve": "D6e7F8g9H0",
  "eajimenezg@estudiante.unexpo.edu.ve": "I1j2K3l4M5",
};

const initialTeacherPasswords: PasswordRecord = {
  "dacevedo@unexpo.edu.ve": "lfsbyrt2",
};

/**
 * Create the authentication store with persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      studentPasswords: initialStudentPasswords,
      teacherPasswords: initialTeacherPasswords,
      user: null,
      isAuthenticated: false,

      // Actions
      setStudentPasswords: (passwords) => set({ studentPasswords: passwords }),

      login: (email, password) => {
        const { studentPasswords, teacherPasswords } = get();

        if (studentPasswords[email] === password) {
          const user: User = { email, role: "student" };
          set({ user, isAuthenticated: true });
          return true;
        }

        if (teacherPasswords[email] === password) {
          const user: User = { email, role: "teacher" };
          set({ user, isAuthenticated: true });
          return true;
        }

        return false;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      analyzePasswords: () => {
        const { studentPasswords, teacherPasswords } = get();
        const allPasswords = { ...studentPasswords, ...teacherPasswords };
        const passwordValues = Object.values(allPasswords);

        const missingPasswords = Object.keys(allPasswords).filter(
          (email) => !allPasswords[email]
        );

        const repeatedPasswords = passwordValues.filter(
          (password, index, self) => self.indexOf(password) !== index
        );

        return { missingPasswords, repeatedPasswords };
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
