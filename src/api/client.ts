/**
 * API Client
 *
 * Base configuration for API requests and centralized error handling
 */
import { toast } from "react-hot-toast";

// Default request configuration
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Error handling
const handleApiError = (error: unknown): never => {
  // Log the error for debugging
  console.error("API Error:", error);

  // Display user-friendly message
  const errorMessage = error.message || "An unexpected error occurred";
  toast.error(errorMessage);

  // Re-throw for component-level handling
  throw error;
};

// Base API methods
export const apiClient = {
  /**
   * Perform a GET request
   */
  async get<T>(url: string, headers = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { ...DEFAULT_HEADERS, ...headers },
      });

      if (!response.ok) {
        throw new Error(
          `Network error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Perform a POST request
   */
  async post<T, U = unknown>(url: string, data: U, headers = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { ...DEFAULT_HEADERS, ...headers },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Network error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Perform a PUT request
   */
  async put<T, U = unknown>(url: string, data: U, headers = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { ...DEFAULT_HEADERS, ...headers },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Network error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Perform a DELETE request
   */
  async delete<T>(url: string, headers = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: { ...DEFAULT_HEADERS, ...headers },
      });

      if (!response.ok) {
        throw new Error(
          `Network error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};
