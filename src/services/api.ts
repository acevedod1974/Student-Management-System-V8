import { supabase } from "../utils/supabaseClient";
import { apiCache } from "../utils/cache";
import { Course, Student, Grade } from "../types";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  async handleResponse<T>(
    promise: Promise<{
      data: T | null;
      error: { status?: number; message?: string } | null;
    }>,
    cacheKey?: string
  ) {
    try {
      // Check cache first if cacheKey is provided
      if (cacheKey) {
        const cachedData = apiCache.get<T>(cacheKey);
        if (cachedData) return cachedData;
      }

      const { data, error } = await promise;

      if (error) {
        throw new ApiError(
          error.status || 500,
          error.message || "An unexpected error occurred"
        );
      }

      // Cache the successful response if cacheKey is provided
      if (cacheKey && data) {
        apiCache.set(cacheKey, data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        500,
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  },

  courses: {
    async getAll() {
      return api.handleResponse(
        supabase.from("courses").select("*"),
        "courses:all"
      );
    },

    async getById(id: string) {
      return api.handleResponse(
        supabase.from("courses").select("*").eq("id", id).single(),
        `courses:${id}`
      );
    },

    async create(course: Omit<Course, "id">) {
      const result = await api.handleResponse(
        supabase.from("courses").insert(course).select().single()
      );
      // Invalidate related caches
      apiCache.invalidatePattern(/^courses:/);
      return result;
    },

    async update(id: string, course: Partial<Course>) {
      const result = await api.handleResponse(
        supabase.from("courses").update(course).eq("id", id).select().single()
      );
      // Invalidate related caches
      apiCache.invalidate(`courses:${id}`);
      apiCache.invalidate("courses:all");
      return result;
    },
  },

  students: {
    async getAll() {
      return api.handleResponse(
        supabase.from("students").select("*"),
        "students:all"
      );
    },

    async getById(id: string) {
      return api.handleResponse(
        supabase.from("students").select("*").eq("id", id).single(),
        `students:${id}`
      );
    },

    async create(student: Omit<Student, "id">) {
      const result = await api.handleResponse(
        supabase.from("students").insert(student).select().single()
      );
      // Invalidate related caches
      apiCache.invalidatePattern(/^students:/);
      return result;
    },

    async update(id: string, student: Partial<Student>) {
      const result = await api.handleResponse(
        supabase.from("students").update(student).eq("id", id).select().single()
      );
      // Invalidate related caches
      apiCache.invalidate(`students:${id}`);
      apiCache.invalidate("students:all");
      return result;
    },
  },

  grades: {
    async getByStudentId(studentId: string) {
      return api.handleResponse(
        supabase.from("grades").select("*").eq("studentId", studentId),
        `grades:student:${studentId}`
      );
    },

    async getByCourseId(courseId: string) {
      return api.handleResponse(
        supabase.from("grades").select("*").eq("courseId", courseId),
        `grades:course:${courseId}`
      );
    },

    async create(grade: Omit<Grade, "id">) {
      const result = await api.handleResponse(
        supabase.from("grades").insert(grade).select().single()
      );
      // Invalidate related caches
      apiCache.invalidatePattern(/^grades:/);
      return result;
    },

    async update(id: string, grade: Partial<Grade>) {
      const result = await api.handleResponse(
        supabase.from("grades").update(grade).eq("id", id).select().single()
      );
      // Invalidate related caches
      apiCache.invalidatePattern(/^grades:/);
      return result;
    },

    async bulkCreate(grades: Omit<Grade, "id">[]) {
      const result = await api.handleResponse(
        supabase.from("grades").insert(grades).select()
      );
      // Invalidate related caches
      apiCache.invalidatePattern(/^grades:/);
      return result;
    },
  },
};
