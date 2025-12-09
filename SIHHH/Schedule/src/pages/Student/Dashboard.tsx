// src/pages/Student/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Import the separate modules
import CurrentTimetable from './currentTimetable';
import PreviousTimetable from './previousTimetable';
import Feedback from './feedback';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface PersonalInfo {
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  program: string;
  semester: string;
  cgpa: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<'currentTimetable' | 'previousTimetable' | 'feedback' | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Student data
  const studentData = {
    personalInfo: {
      name: user?.name || "Rahul Sharma",
      rollNo: "2023001",
      email: user?.email || "rahul.sharma@college.edu",
      phone: "+91 9876543210",
      program: "B.Tech Computer Science",
      semester: "3rd",
      cgpa: "8.7"
    }
  };

  // Notifications data
  useEffect(() => {
    setNotifications([
      { 
        id: 1, 
        type: "college", 
        title: "Republic Day Holiday", 
        message: "College will remain closed on 26th January", 
        date: "2024-01-20", 
        read: false 
      },
      { 
        id: 2, 
        type: "department", 
        title: "DSA Lab Rescheduled", 
        message: "Lab session moved to Friday 2PM", 
        date: "2024-01-19", 
        read: false 
      },
      { 
        id: 3, 
        type: "academic", 
        title: "Mid Term Exams", 
        message: "Mid term exams starting from next week", 
        date: "2024-01-18", 
        read: false 
      }
    ]);
  }, []);

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Main Dashboard Cards with Glassmorphism
  const DashboardCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Current Timetable Card - Blue to Cyan Gradient */}
      <div 
        className="relative bg-gradient-to-br from-blue-500/20 via-blue-400/25 to-cyan-500/30 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
        onClick={() => setActiveModule('currentTimetable')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/20 rounded-2xl group-hover:from-blue-500/20 group-hover:to-cyan-500/30 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-cyan-300 text-xl font-bold bg-white/10 px-3 py-1 rounded-full">Current</span>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Current Timetable</h3>
          <p className="text-blue-200 text-sm">View and download current schedule</p>
          <div className="absolute bottom-4 right-4 text-cyan-300 group-hover:translate-x-1 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Previous Timetable Card - Purple to Pink Gradient */}
      <div 
        className="relative bg-gradient-to-br from-purple-500/20 via-purple-400/25 to-pink-500/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
        onClick={() => setActiveModule('previousTimetable')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/20 rounded-2xl group-hover:from-purple-500/20 group-hover:to-pink-500/30 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-pink-300 text-xl font-bold bg-white/10 px-3 py-1 rounded-full">Previous</span>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Previous Timetable</h3>
          <p className="text-purple-200 text-sm">Access past semester schedules</p>
          <div className="absolute bottom-4 right-4 text-pink-300 group-hover:translate-x-1 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Feedback Card - Green to Emerald Gradient */}
      <div 
        className="relative bg-gradient-to-br from-green-500/20 via-emerald-400/25 to-teal-500/30 backdrop-blur-lg rounded-2xl p-6 border border-emerald-400/30 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
        onClick={() => setActiveModule('feedback')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/20 rounded-2xl group-hover:from-green-500/20 group-hover:to-teal-500/30 transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-3 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-emerald-300 text-xl font-bold bg-white/10 px-3 py-1 rounded-full">Share</span>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Feedback</h3>
          <p className="text-emerald-200 text-sm">Share your suggestions & feedback</p>
          <div className="absolute bottom-4 right-4 text-teal-300 group-hover:translate-x-1 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // Notifications Panel
  const NotificationsPanel = () => (
    <div className="absolute top-12 left-0 w-80 bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-600/30 z-50">
      <div className="p-4 border-b border-slate-600/30">
        <h3 className="text-white font-semibold">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 border-b border-slate-700/30 hover:bg-slate-700/50 cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-500/10' : ''
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex justify-between items-start">
              <span className={`text-xs px-2 py-1 rounded ${
                notification.type === 'urgent' ? 'bg-red-500/20 text-red-300' : 
                notification.type === 'college' ? 'bg-blue-500/20 text-blue-300' : 
                notification.type === 'academic' ? 'bg-orange-500/20 text-orange-300' : 
                notification.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
              }`}>
                {notification.type.toUpperCase()}
              </span>
              <span className="text-slate-400 text-xs">{notification.date}</span>
            </div>
            <h4 className="text-white font-semibold mt-2">{notification.title}</h4>
            <p className="text-slate-300 text-sm mt-1">{notification.message}</p>
            {!notification.read && (
              <div className="flex items-center mt-2 text-blue-400 text-xs">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                Unread
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Profile Dropdown
  const ProfileDropdown = () => (
    <div className="absolute top-12 right-0 w-64 bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-600/30 z-50">
      <div className="p-4 border-b border-slate-600/30">
        <h3 className="text-white font-semibold">Profile</h3>
      </div>
      <div className="p-4">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl">
            {studentData.personalInfo.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h4 className="text-white font-semibold">{studentData.personalInfo.name}</h4>
          <p className="text-slate-400 text-sm">{studentData.personalInfo.rollNo}</p>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Program:</span>
            <span className="text-white">{studentData.personalInfo.program}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Semester:</span>
            <span className="text-white">{studentData.personalInfo.semester}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">CGPA:</span>
            <span className="text-green-400 font-semibold">{studentData.personalInfo.cgpa}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Email:</span>
            <span className="text-white text-xs">{studentData.personalInfo.email}</span>
          </div>
        </div>

        <button className="w-full mt-4 bg-blue-600/50 hover:bg-blue-600/70 text-white py-2 rounded-lg transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header with Notifications on Left */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          {/* Notifications Bell - Left Side */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-300 hover:text-white transition-colors bg-white/10 rounded-xl hover:bg-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.78-5.56m11.56 5.56A5.97 5.97 0 0015 2a5.97 5.97 0 00-4.24 1.76M18 10a6 6 0 10-12 0c0 4.09 1.34 6.78 3.47 8.64C10 20.18 10.93 21 12 21s2-.82 2.53-1.36C16.66 16.78 18 14.09 18 10z" />
              </svg>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            {showNotifications && <NotificationsPanel />}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
            <p className="text-slate-400">Welcome to your learning portal</p>
          </div>
        </div>
        
        {/* Profile on Right */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl p-2 transition-colors border border-slate-600/30"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {studentData.personalInfo.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-semibold">{studentData.personalInfo.name}</p>
              <p className="text-slate-400 text-xs">{studentData.personalInfo.rollNo}</p>
            </div>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showProfile && <ProfileDropdown />}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {activeModule === null ? (
          <>
            {/* Dashboard Cards */}
            <DashboardCards />
            
            {/* Quick Stats */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-600/30 rounded-xl border border-green-500/30">
                  <div className="text-3xl font-bold text-green-400 mb-2">{studentData.personalInfo.cgpa}</div>
                  <div className="text-green-200">Current CGPA</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-cyan-600/30 rounded-xl border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-400 mb-2">85%</div>
                  <div className="text-blue-200">Attendance</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-amber-600/30 rounded-xl border border-orange-500/30">
                  <div className="text-3xl font-bold text-orange-400 mb-2">3</div>
                  <div className="text-orange-200">Pending Assignments</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-600/30 rounded-xl border border-purple-500/30">
                  <div className="text-3xl font-bold text-purple-400 mb-2">12</div>
                  <div className="text-purple-200">Days to Exams</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {activeModule === 'currentTimetable' && 'Current Timetable'}
                {activeModule === 'previousTimetable' && 'Previous Timetable'}
                {activeModule === 'feedback' && 'Feedback & Suggestions'}
              </h2>
              <button 
                onClick={() => setActiveModule(null)}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            
            {/* Render the respective module */}
            {activeModule === 'currentTimetable' && <CurrentTimetable />}
            {activeModule === 'previousTimetable' && <PreviousTimetable />}
            {activeModule === 'feedback' && <Feedback />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;