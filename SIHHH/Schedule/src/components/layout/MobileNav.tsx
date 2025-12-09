import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  User,
  Settings,
} from 'lucide-react';

const adminTabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/timetable-generator', icon: Calendar, label: 'Generate' },
  { to: '/manage-courses', icon: BookOpen, label: 'Courses' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const facultyTabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/my-timetable', icon: Calendar, label: 'Timetable' },
  { to: '/availability', icon: BookOpen, label: 'Availability' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const studentTabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/my-timetable', icon: Calendar, label: 'Timetable' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const MobileNav: React.FC = () => {
  const { user } = useAuth();

  const tabs = user?.role === 'Admin' 
    ? adminTabs 
    : user?.role === 'Faculty' 
    ? facultyTabs 
    : studentTabs;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/20 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'p-2 rounded-xl transition-all',
                    isActive && 'bg-primary/20'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
