/**
 * Courses API Service
 *
 * Handles all course-related API operations
 */
import { Course } from "../../features/courses/types";
import { supabase } from "../../utils/supabaseClient";

// Removed unused BASE_URL constant

/**
 * Courses API service
 */
export const coursesApi = {
  /**
   * Get all courses
   */
  async getAllCourses(): Promise<Course[]> {
    // If using a real API endpoint:
    // return await apiClient.get<Course[]>(BASE_URL);

    // Current implementation using local storage via Zustand
    const { data, error } = await supabase.from("courses").select("*");

    if (error) throw error;
    return data as Course[];
  },

  /**
   * Get a course by ID
   */
  async getCourseById(id: string): Promise<Course> {
    // If using a real API endpoint:
    // return await apiClient.get<Course>(`${BASE_URL}/${id}`);

    // Current implementation using local storage via Zustand
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Course;
  },

  /**
   * Create a new course
   */
  async createCourse(course: Omit<Course, "id">): Promise<Course> {
    // If using a real API endpoint:
    // return await apiClient.post<Course>(BASE_URL, course);

    // Current implementation using local storage via Zustand
    const newCourse = {
      ...course,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("courses")
      .insert(newCourse)
      .select();

    if (error) throw error;
    return data[0] as Course;
  },

  /**
   * Update an existing course
   */
  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    // If using a real API endpoint:
    // return await apiClient.put<Course>(`${BASE_URL}/${id}`, updates);

    // Current implementation using local storage via Zustand
    const { data, error } = await supabase
      .from("courses")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0] as Course;
  },

  /**
   * Delete a course
   */
  async deleteCourse(id: string): Promise<void> {
    // If using a real API endpoint:
    // await apiClient.delete(`${BASE_URL}/${id}`);

    // Current implementation using local storage via Zustand
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) throw error;
  },
};
