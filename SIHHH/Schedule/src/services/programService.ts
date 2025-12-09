// src/services/programsService.js
import api from "@/lib/api";

export const getPrograms = () => api.get("/programs");
export const getProgram = (id) => api.get(`/programs/${id}`);
export const createProgram = (payload) => api.post("/programs", payload);
export const updateProgram = (id, payload) => api.put(`/programs/${id}`, payload);
export const deleteProgram = (id) => api.delete(`/programs/${id}`);

// courses (for dropdown)
export const getCourses = () => api.get("/courses");
