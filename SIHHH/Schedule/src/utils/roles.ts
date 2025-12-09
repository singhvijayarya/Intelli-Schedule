// src/utils/roles.ts
export type Role = "admin" | "faculty" | "student" | null;

export function normalizeRole(r?: string | null): Role {
  if (!r) return null;
  const s = String(r).trim().toLowerCase();
  if (s.startsWith("admin")) return "admin";
  if (s.startsWith("faculty") || s.startsWith("teacher")) return "faculty";
  if (s.startsWith("student") || s.startsWith("user")) return "student";
  return null;
}
