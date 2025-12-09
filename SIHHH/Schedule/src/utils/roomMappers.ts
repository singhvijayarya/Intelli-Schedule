// src/utils/roomMappers.ts
import { ApiRoom } from "../services/roomService";

export type UiRoom = {
  id: string;              // maps from _id
  roomNumber: string;      // optional, you may store in notes or name
  roomName: string;        // maps to name
  capacity: string;        // string in UI, convert to number
  roomType: string;        // maps to type (convert names)
  equipment: string;       // comma separated string -> features[]
  building: string;
  floor: string;
  availability?: string;   // local UI-only
  maintenanceSchedule?: string; // local UI-only
};

// convert API -> UI
export const fromApi = (a: ApiRoom): UiRoom => ({
  id: a._id || "",
  roomNumber: "", // if you want a separate roomNumber field, you can embed it in `notes` or name; set blank if not present
  roomName: a.name || "",
  capacity: String(a.capacity || 0),
  roomType: mapTypeApiToUi(a.type || "lecture"),
  equipment: (a.features || []).join(", "),
  building: a.building || "",
  floor: a.floor || "",
  availability: a.isActive ? "Available" : "Maintenance",
  maintenanceSchedule: a.notes || "",
});

// convert UI -> API payload
export const toApi = (u: UiRoom): Partial<ApiRoom> => ({
  name: u.roomName,
  building: u.building || undefined,
  floor: u.floor || undefined,
  capacity: Number(u.capacity || 0),
  type: mapTypeUiToApi(u.roomType),
  features: u.equipment ? u.equipment.split(",").map(s => s.trim()).filter(Boolean) : [],
  isActive: (u.availability || "Available") === "Available",
  notes: u.maintenanceSchedule || undefined,
});

// helper mapping (adjust names if you prefer)
const mapTypeUiToApi = (t: string) => {
  const low = t.toLowerCase();
  if (low.includes("lab")) return "lab";
  if (low.includes("auditorium")) return "auditorium";
  if (low.includes("conference") || low.includes("class")) return "lecture";
  if (low.includes("science")) return "lab";
  return "other";
};

const mapTypeApiToUi = (t: string) => {
  if (!t) return "Classroom";
  switch (t) {
    case "lab": return "Lab";
    case "auditorium": return "Auditorium";
    case "seminar": return "Conference Room";
    case "lecture": return "Classroom";
    default: return "Other";
  }
};
