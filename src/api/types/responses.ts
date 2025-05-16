/**
 * API Response Types
 *
 * Type definitions for API responses
 */

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Paginated API response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Error response from API
 */
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}
