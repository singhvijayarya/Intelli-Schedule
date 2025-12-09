// src/services/coursesService.ts
import api from "../lib/api";

export interface CourseCreatePayload {
  programId: string;
  semester: number;
  category?: string; // match enum (e.g. "CORE", "AEC", ...)
  courseCode?: string;
  courseName: string;
  credits?: number;
  ltp?: { lecture?: number; tutorial?: number; practical?: number };
  duration?: string;
  department?: string;
  prerequisites?: string;
  description?: string;
  fee?: number;
  status?: "Active" | "Inactive";
}

export const getAllCourses = (params?: Record<string, any>) =>
  api.get("/courses", { params });

export const getCourseById = (id: string) => api.get(`/courses/${id}`);

export const createCourse = (payload: CourseCreatePayload) =>
  api.post("/courses", payload);

export const updateCourse = (id: string, payload: Partial<CourseCreatePayload>) =>
  api.put(`/courses/${id}`, payload);

export const deleteCourse = (id: string) => api.delete(`/courses/${id}`);
