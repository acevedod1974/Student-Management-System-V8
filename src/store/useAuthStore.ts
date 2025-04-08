/**
 *
 * Student Management System
 *
 * Description: The Student Management System is a comprehensive web application designed to manage student data efficiently.
 * Built with modern web technologies, this system offers a robust and user-friendly interface for managing courses, students, and their performance.
 *
 * Technologies Used:
 * - React
 * - TypeScript
 * - Zustand (State Management)
 * - Tailwind CSS (Styling)
 * - Vite (Building and Serving)
 *
 * Author: Daniel Acevedo Lopez
 * GitHub: https://github.com/acevedod1974/Student-Management-System-V4
 *
 * Copyright © 2023 Daniel Acevedo Lopez. All rights reserved.
 *
 * This project is licensed under the MIT License. See the LICENSE file for more details.
 */

import { create } from "zustand";
import { supabase } from "../utils/supabaseClient";
import { User } from "@supabase/supabase-js";
import { SecurityMiddleware } from "../middleware/security";

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const security = SecurityMiddleware.getInstance();

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      // Check rate limiting
      const identifier = `auth:${email}`;
      if (!security.checkRateLimit(identifier)) {
        throw new Error("Too many login attempts. Please try again later.");
      }

      // Sanitize input
      const sanitizedEmail = security.sanitizeRequestData({ email }).email;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) throw error;

      // Reset rate limit on successful login
      security.resetRateLimit(identifier);
      set({ user: data.user });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during login",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during logout",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      set({ loading: true, error: null });

      // Verify current password first
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("User not found");

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (verifyError) throw new Error("Current password is incorrect");

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while changing password",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
