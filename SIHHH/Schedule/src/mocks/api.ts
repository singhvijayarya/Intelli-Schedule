import { mockUsers, mockTimetableSlots, dashboardStats } from './data';
import { User, UserRole } from '@/types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for registered users (persists during session)
const registeredUsers: Record<string, { password: string; user: User }> = { ...mockUsers };

export const mockApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User } | null> => {
    await delay(800);
    const userData = registeredUsers[email];
    if (userData && userData.password === password) {
      const token = btoa(JSON.stringify({ email, role: userData.user.role, exp: Date.now() + 86400000 }));
      return { token, user: userData.user };
    }
    return null;
  },

  register: async (email: string, password: string, name: string, role: UserRole): Promise<{ token: string; user: User } | null> => {
    await delay(800);
    
    // Check if email already exists
    if (registeredUsers[email]) {
      return null;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };

    registeredUsers[email] = { password, user: newUser };
    
    const token = btoa(JSON.stringify({ email, role: newUser.role, exp: Date.now() + 86400000 }));
    return { token, user: newUser };
  },

  getMe: async (token: string): Promise<User | null> => {
    await delay(300);
    try {
      const decoded = JSON.parse(atob(token));
      const userData = registeredUsers[decoded.email];
      if (userData && decoded.exp > Date.now()) {
        return userData.user;
      }
    } catch {
      return null;
    }
    return null;
  },

  getTimetable: async (semester?: number): Promise<typeof mockTimetableSlots> => {
    await delay(500);
    return mockTimetableSlots;
  },

  generateTimetable: async (constraints: any): Promise<{ success: boolean; timetable: typeof mockTimetableSlots }> => {
    await delay(2000); // Simulate longer processing
    return { success: true, timetable: mockTimetableSlots };
  },

  getDashboardStats: async (role: string) => {
    await delay(400);
    switch (role) {
      case 'Admin':
        return dashboardStats.admin;
      case 'Faculty':
        return dashboardStats.faculty;
      case 'Student':
        return dashboardStats.student;
      default:
        return {};
    }
  },
};
