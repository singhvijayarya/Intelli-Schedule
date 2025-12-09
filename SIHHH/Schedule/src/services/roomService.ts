// src/services/roomService.ts
import api from "../lib/api";

export type ApiRoom = {
  _id?: string;
  name: string;
  building?: string;
  floor?: string;
  capacity: number;
  type?: "lecture" | "lab" | "seminar" | "auditorium" | "other" | string;
  features?: string[]; // e.g. ["projector"]
  isActive?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const getRooms = async (): Promise<ApiRoom[]> => {
  const res = await api.get("/rooms");
   return res.data.data; // assume backend returns array
};

export const getRoomById = async (id: string): Promise<ApiRoom> => {
  const res = await api.get(`/rooms/${id}`);
   return res.data.data;
};

export const createRoom = async (payload: Partial<ApiRoom>): Promise<ApiRoom> => {
  const res = await api.post("/rooms", payload);
   return res.data.data;
};

export const updateRoom = async (id: string, payload: Partial<ApiRoom>): Promise<ApiRoom> => {
  const res = await api.put(`/rooms/${id}`, payload);
   return res.data.data;
};

export const deleteRoom = async (id: string): Promise<void> => {
  await api.delete(`/rooms/${id}`);
};
