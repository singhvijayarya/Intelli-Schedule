// src/pages/Faculty/Availability.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
  type: "Teaching" | "Office Hours" | "Research" | "Meeting" | "Unavailable";
}

interface AvailabilityDay {
  day: string;
  slots: TimeSlot[];
}

export default function Availability() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailabilityDay[]>([
    {
      day: "Monday",
      slots: [
        { id: "1", day: "Monday", startTime: "09:00", endTime: "11:00", available: true, type: "Teaching" },
        { id: "2", day: "Monday", startTime: "11:00", endTime: "13:00", available: true, type: "Office Hours" },
        { id: "3", day: "Monday", startTime: "14:00", endTime: "17:00", available: true, type: "Research" }
      ]
    },
    {
      day: "Tuesday",
      slots: [
        { id: "4", day: "Tuesday", startTime: "10:00", endTime: "12:00", available: true, type: "Teaching" },
        { id: "5", day: "Tuesday", startTime: "13:00", endTime: "15:00", available: true, type: "Research" }
      ]
    },
    {
      day: "Wednesday",
      slots: [
        { id: "6", day: "Wednesday", startTime: "09:00", endTime: "12:00", available: true, type: "Teaching" },
        { id: "7", day: "Wednesday", startTime: "14:00", endTime: "16:00", available: true, type: "Office Hours" }
      ]
    },
    {
      day: "Thursday",
      slots: [
        { id: "8", day: "Thursday", startTime: "11:00", endTime: "13:00", available: true, type: "Research" },
        { id: "9", day: "Thursday", startTime: "15:00", endTime: "17:00", available: true, type: "Meeting" }
      ]
    },
    {
      day: "Friday",
      slots: [
        { id: "10", day: "Friday", startTime: "09:00", endTime: "12:00", available: true, type: "Teaching" },
        { id: "11", day: "Friday", startTime: "13:00", endTime: "15:00", available: false, type: "Unavailable" }
      ]
    }
  ]);

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getTypeColor = (type: string) => {
    switch(type) {
      case "Teaching": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Office Hours": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Research": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Meeting": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "Unavailable": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const toggleAvailability = (dayIndex: number, slotIndex: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots[slotIndex].available = 
      !updatedAvailability[dayIndex].slots[slotIndex].available;
    setAvailability(updatedAvailability);
  };

  const addTimeSlot = (dayIndex: number) => {
    const updatedAvailability = [...availability];
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      day: updatedAvailability[dayIndex].day,
      startTime: "09:00",
      endTime: "10:00",
      available: true,
      type: "Teaching"
    };
    updatedAvailability[dayIndex].slots.push(newSlot);
    setAvailability(updatedAvailability);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots.splice(slotIndex, 1);
    setAvailability(updatedAvailability);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: string, value: string) => {
    const updatedAvailability = [...availability];
    (updatedAvailability[dayIndex].slots[slotIndex] as any)[field] = value;
    setAvailability(updatedAvailability);
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
            Availability Settings
          </motion.h1>
          <p className="text-slate-400">
            Set your teaching availability and office hours
          </p>
        </div>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-white px-6 py-3 rounded-xl font-semibold border border-green-500/30 transition-all mt-4 md:mt-0"
        >
          Save Availability
        </motion.button>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 mb-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Availability Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {["Teaching", "Office Hours", "Research", "Meeting", "Unavailable"].map(type => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getTypeColor(type).split(' ')[0]}`}></div>
              <span className="text-slate-300 text-sm">{type}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Availability Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6"
      >
        {availability.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="w-3 h-3 bg-teal-500 rounded-full mr-3"></span>
                {day.day}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addTimeSlot(dayIndex)}
                className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold border border-teal-500/30 transition-all"
              >
                + Add Slot
              </motion.button>
            </div>

            {day.slots.length > 0 ? (
              <div className="grid gap-4">
                {day.slots.map((slot, slotIndex) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 gap-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-6 flex-1">
                      {/* Time Inputs */}
                      <div className="flex items-center space-x-3">
                        <label className="text-slate-400 text-sm">From</label>
                        <select
                          value={slot.startTime}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, "startTime", e.target.value)}
                          className="bg-slate-600/50 border border-slate-500 rounded-lg px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <label className="text-slate-400 text-sm">To</label>
                        <select
                          value={slot.endTime}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, "endTime", e.target.value)}
                          className="bg-slate-600/50 border border-slate-500 rounded-lg px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      {/* Activity Type */}
                      <select
                        value={slot.type}
                        onChange={(e) => updateTimeSlot(dayIndex, slotIndex, "type", e.target.value)}
                        className="bg-slate-600/50 border border-slate-500 rounded-lg px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                      >
                        <option value="Teaching">Teaching</option>
                        <option value="Office Hours">Office Hours</option>
                        <option value="Research">Research</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>

                      {/* Availability Toggle */}
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-400 text-sm">Available:</span>
                        <button
                          onClick={() => toggleAvailability(dayIndex, slotIndex)}
                          className={`w-12 h-6 rounded-full transition-all ${
                            slot.available ? 'bg-teal-500' : 'bg-slate-600'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                            slot.available ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-white px-3 py-2 rounded-lg text-sm border border-red-500/30 transition-all"
                    >
                      Remove
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No time slots added for {day.day}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8"
      >
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-teal-400 mb-1">
            {availability.flatMap(day => day.slots).length}
          </div>
          <div className="text-slate-400 text-sm">Total Slots</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {availability.flatMap(day => day.slots).filter(slot => slot.available).length}
          </div>
          <div className="text-slate-400 text-sm">Available Slots</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {availability.flatMap(day => day.slots).filter(slot => slot.type === "Teaching").length}
          </div>
          <div className="text-slate-400 text-sm">Teaching Hours</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {availability.flatMap(day => day.slots).filter(slot => slot.type === "Office Hours").length}
          </div>
          <div className="text-slate-400 text-sm">Office Hours</div>
        </div>
      </motion.div>
    </div>
  );
}