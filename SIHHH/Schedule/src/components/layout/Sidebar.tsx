import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  BookOpen,
  DoorOpen,
  Settings,
  HelpCircle,
  Clock,
  FileSpreadsheet,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const adminLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timetable-generator', icon: Calendar, label: 'Generate Timetable' },
  { to: '/manage-courses', icon: BookOpen, label: 'Manage Courses' },
  { to: '/manage-rooms', icon: DoorOpen, label: 'Manage Rooms' },
  { to: '/manage-users', icon: Users, label: 'User Management' },
];

const facultyLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/my-timetable', icon: Calendar, label: 'My Timetable' },
  { to: '/availability', icon: Clock, label: 'Availability' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/my-timetable', icon: Calendar, label: 'My Timetable' },
  { to: '/courses', icon: BookOpen, label: 'My Courses' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const commonLinks = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user } = useAuth();

  const roleLinks = user?.role === 'Admin' 
    ? adminLinks 
    : user?.role === 'Faculty' 
    ? facultyLinks 
    : studentLinks;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-40 glass border-r border-border/20 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h1 className="font-display font-bold text-lg gradient-text">TimetableAI</h1>
                <p className="text-xs text-muted-foreground">SIH25091</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {roleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )
                }
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="animate-fade-in">{link.label}</span>}
              </NavLink>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-border/20">
            <div className="space-y-1 px-2">
              {commonLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )
                  }
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="animate-fade-in">{link.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="p-4 border-t border-border/20 hover:bg-muted/50 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 mx-auto text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>
    </aside>
  );
};
