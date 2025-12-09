export type UserRole = 'Admin' | 'Faculty' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  type: 'theory' | 'practical' | 'both';
  department: string;
  semester: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string[];
  availability: TimeSlot[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  semester: number;
  department: string;
  enrolledCourses: string[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'lecture' | 'lab' | 'seminar';
  building: string;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface TimetableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  course: Course;
  faculty: Faculty;
  room: Room;
  type: 'theory' | 'practical';
}

export interface Timetable {
  id: string;
  semester: number;
  department: string;
  slots: TimetableSlot[];
  generatedAt: string;
}

export interface GenerationConstraints {
  maxHoursPerDay: number;
  breakDuration: number;
  preferredSlots: TimeSlot[];
  avoidSlots: TimeSlot[];
}
