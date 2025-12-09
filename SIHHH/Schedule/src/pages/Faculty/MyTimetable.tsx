// src/pages/Faculty/MyTimetable.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  courseCode: string;
  room: string;
  type: "Lecture" | "Lab" | "Tutorial" | "Meeting";
  duration: string;
}

export default function MyTimetable() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const timetableData: TimetableEntry[] = [
    {
      id: "1",
      day: "Monday",
      time: "09:00-10:30",
      subject: "Data Structures & Algorithms",
      courseCode: "CS201",
      room: "LAB-201",
      type: "Lab",
      duration: "1.5 hours"
    },
    {
      id: "2",
      day: "Monday",
      time: "11:00-12:00",
      subject: "Database Management Systems",
      courseCode: "CS202",
      room: "LT-301",
      type: "Lecture",
      duration: "1 hour"
    },
    {
      id: "3",
      day: "Tuesday",
      time: "10:00-11:30",
      subject: "Computer Networks",
      courseCode: "CS301",
      room: "LAB-302",
      type: "Lab",
      duration: "1.5 hours"
    },
    {
      id: "4",
      day: "Wednesday",
      time: "14:00-16:00",
      subject: "Software Engineering",
      courseCode: "CS401",
      room: "LT-202",
      type: "Lecture",
      duration: "2 hours"
    },
    {
      id: "5",
      day: "Thursday",
      time: "09:30-11:00",
      subject: "Operating Systems",
      courseCode: "CS302",
      room: "LAB-201",
      type: "Lab",
      duration: "1.5 hours"
    },
    {
      id: "6",
      day: "Friday",
      time: "13:00-14:00",
      subject: "Faculty Meeting",
      courseCode: "ADMIN",
      room: "Conference Room",
      type: "Meeting",
      duration: "1 hour"
    }
  ];

  const filteredTimetable = timetableData.filter(entry => 
    viewMode === "daily" ? entry.day === selectedDay : true
  );

  const getTypeColor = (type: string) => {
    switch(type) {
      case "Lecture": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Lab": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Tutorial": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Meeting": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            My Timetable
          </motion.h1>
          <p className="text-slate-400">
            Manage your teaching schedule and classes
          </p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4 mt-4 md:mt-0"
        >
          {/* View Mode Toggle */}
          <div className="bg-slate-800/50 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode("daily")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "daily" 
                  ? "bg-purple-500/20 text-purple-300" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "weekly" 
                  ? "bg-purple-500/20 text-purple-300" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Weekly
            </button>
          </div>
        </motion.div>
      </div>

      {/* Day Selector for Daily View */}
      {viewMode === "daily" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedDay === day
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              {day}
            </button>
          ))}
        </motion.div>
      )}

      {/* Timetable Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6"
      >
        {viewMode === "weekly" ? (
          // Weekly View - Group by Day
          days.map(day => {
            const dayClasses = timetableData.filter(entry => entry.day === day);
            return (
              <motion.div
                key={day}
                variants={itemVariants}
                className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  {day}
                  <span className="ml-2 text-slate-400 text-sm font-normal">
                    ({dayClasses.length} classes)
                  </span>
                </h3>
                
                {dayClasses.length > 0 ? (
                  <div className="grid gap-3">
                    {dayClasses.map(entry => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-blue-300 font-semibold text-sm bg-blue-500/20 px-3 py-1 rounded-lg">
                            {entry.time}
                          </div>
                          <div>
                            <div className="text-white font-semibold">{entry.subject}</div>
                            <div className="text-slate-400 text-sm">{entry.courseCode} • {entry.room}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(entry.type)}`}>
                            {entry.type}
                          </span>
                          <span className="text-slate-400 text-sm">{entry.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No classes scheduled for {day}
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          // Daily View
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
              {selectedDay}'s Schedule
              <span className="ml-2 text-slate-400 text-sm font-normal">
                ({filteredTimetable.length} classes)
              </span>
            </h3>

            {filteredTimetable.length > 0 ? (
              <div className="grid gap-4">
                {filteredTimetable.map(entry => (
                  <motion.div
                    key={entry.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex items-center justify-between p-5 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-blue-300 font-bold text-lg bg-blue-500/20 px-4 py-2 rounded-xl">
                        {entry.time}
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">{entry.subject}</div>
                        <div className="text-slate-400">{entry.courseCode} • {entry.room}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getTypeColor(entry.type)}`}>
                        {entry.type}
                      </span>
                      <span className="text-slate-400">{entry.duration}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-slate-400 text-lg mb-2">No classes scheduled for {selectedDay}</div>
                <div className="text-slate-500 text-sm">Enjoy your free time!</div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
      >
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">{timetableData.length}</div>
          <div className="text-slate-400 text-sm">Total Classes</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {timetableData.filter(c => c.type === "Lecture").length}
          </div>
          <div className="text-slate-400 text-sm">Lectures</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {timetableData.filter(c => c.type === "Lab").length}
          </div>
          <div className="text-slate-400 text-sm">Labs</div>
        </div>
      </motion.div>
    </div>
  );
}