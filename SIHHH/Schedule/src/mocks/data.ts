import { User, Course, Faculty, Room, TimetableSlot } from '@/types';

export const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@example.com': {
    password: 'Password123',
    user: {
      id: '1',
      name: 'Dr. Admin Kumar',
      email: 'admin@example.com',
      role: 'Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  },
  'faculty@example.com': {
    password: 'Password123',
    user: {
      id: '2',
      name: 'Prof. Sharma',
      email: 'faculty@example.com',
      role: 'Faculty',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=faculty',
    },
  },
  'student@example.com': {
    password: 'Password123',
    user: {
      id: '3',
      name: 'Rahul Singh',
      email: 'student@example.com',
      role: 'Student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    },
  },
};

export const mockCourses: Course[] = [
  { id: '1', code: 'CS101', name: 'Introduction to Programming', credits: 4, type: 'both', department: 'Computer Science', semester: 1 },
  { id: '2', code: 'CS201', name: 'Data Structures', credits: 4, type: 'both', department: 'Computer Science', semester: 3 },
  { id: '3', code: 'CS301', name: 'Database Systems', credits: 3, type: 'theory', department: 'Computer Science', semester: 5 },
  { id: '4', code: 'CS302', name: 'Operating Systems', credits: 4, type: 'both', department: 'Computer Science', semester: 5 },
  { id: '5', code: 'CS401', name: 'Machine Learning', credits: 4, type: 'both', department: 'Computer Science', semester: 7 },
  { id: '6', code: 'MA101', name: 'Engineering Mathematics', credits: 3, type: 'theory', department: 'Mathematics', semester: 1 },
  { id: '7', code: 'PH101', name: 'Engineering Physics', credits: 4, type: 'both', department: 'Physics', semester: 1 },
  { id: '8', code: 'EE201', name: 'Digital Electronics', credits: 3, type: 'practical', department: 'Electronics', semester: 3 },
];

export const mockRooms: Room[] = [
  { id: '1', name: 'LH-101', capacity: 120, type: 'lecture', building: 'Main Building' },
  { id: '2', name: 'LH-102', capacity: 80, type: 'lecture', building: 'Main Building' },
  { id: '3', name: 'Lab-A1', capacity: 40, type: 'lab', building: 'CS Block' },
  { id: '4', name: 'Lab-A2', capacity: 40, type: 'lab', building: 'CS Block' },
  { id: '5', name: 'SR-201', capacity: 30, type: 'seminar', building: 'Academic Block' },
  { id: '6', name: 'LH-201', capacity: 100, type: 'lecture', building: 'Academic Block' },
];

export const mockFaculty: Faculty[] = [
  { id: '1', name: 'Dr. Priya Sharma', email: 'priya@example.com', department: 'Computer Science', courses: ['1', '2'], availability: [] },
  { id: '2', name: 'Prof. Rajesh Kumar', email: 'rajesh@example.com', department: 'Computer Science', courses: ['3', '4'], availability: [] },
  { id: '3', name: 'Dr. Anita Singh', email: 'anita@example.com', department: 'Computer Science', courses: ['5'], availability: [] },
  { id: '4', name: 'Prof. Vikram Patel', email: 'vikram@example.com', department: 'Mathematics', courses: ['6'], availability: [] },
  { id: '5', name: 'Dr. Meera Reddy', email: 'meera@example.com', department: 'Physics', courses: ['7'], availability: [] },
];

export const mockTimetableSlots: TimetableSlot[] = [
  { id: '1', day: 'Monday', startTime: '09:00', endTime: '10:00', course: mockCourses[0], faculty: mockFaculty[0] as any, room: mockRooms[0], type: 'theory' },
  { id: '2', day: 'Monday', startTime: '10:00', endTime: '11:00', course: mockCourses[1], faculty: mockFaculty[0] as any, room: mockRooms[0], type: 'theory' },
  { id: '3', day: 'Monday', startTime: '11:00', endTime: '12:00', course: mockCourses[5], faculty: mockFaculty[3] as any, room: mockRooms[1], type: 'theory' },
  { id: '4', day: 'Monday', startTime: '14:00', endTime: '16:00', course: mockCourses[0], faculty: mockFaculty[0] as any, room: mockRooms[2], type: 'practical' },
  { id: '5', day: 'Tuesday', startTime: '09:00', endTime: '10:00', course: mockCourses[2], faculty: mockFaculty[1] as any, room: mockRooms[0], type: 'theory' },
  { id: '6', day: 'Tuesday', startTime: '10:00', endTime: '11:00', course: mockCourses[3], faculty: mockFaculty[1] as any, room: mockRooms[0], type: 'theory' },
  { id: '7', day: 'Tuesday', startTime: '14:00', endTime: '16:00', course: mockCourses[1], faculty: mockFaculty[0] as any, room: mockRooms[2], type: 'practical' },
  { id: '8', day: 'Wednesday', startTime: '09:00', endTime: '10:00', course: mockCourses[4], faculty: mockFaculty[2] as any, room: mockRooms[5], type: 'theory' },
  { id: '9', day: 'Wednesday', startTime: '10:00', endTime: '12:00', course: mockCourses[6], faculty: mockFaculty[4] as any, room: mockRooms[3], type: 'practical' },
  { id: '10', day: 'Thursday', startTime: '09:00', endTime: '10:00', course: mockCourses[0], faculty: mockFaculty[0] as any, room: mockRooms[0], type: 'theory' },
  { id: '11', day: 'Thursday', startTime: '11:00', endTime: '12:00', course: mockCourses[2], faculty: mockFaculty[1] as any, room: mockRooms[1], type: 'theory' },
  { id: '12', day: 'Friday', startTime: '09:00', endTime: '11:00', course: mockCourses[4], faculty: mockFaculty[2] as any, room: mockRooms[2], type: 'practical' },
  { id: '13', day: 'Friday', startTime: '11:00', endTime: '12:00', course: mockCourses[5], faculty: mockFaculty[3] as any, room: mockRooms[0], type: 'theory' },
];

export const dashboardStats = {
  admin: {
    totalStudents: 1250,
    totalFaculty: 85,
    totalRooms: 42,
    totalCourses: 156,
    activeSchedules: 8,
    pendingRequests: 12,
  },
  faculty: {
    assignedCourses: 4,
    totalClasses: 18,
    upcomingClasses: 3,
    swapRequests: 2,
  },
  student: {
    enrolledCourses: 6,
    totalCredits: 22,
    attendancePercent: 87,
    upcomingClasses: 4,
  },
};
