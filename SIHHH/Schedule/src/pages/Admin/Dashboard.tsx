// src/pages/admin/Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {getPrograms} from "@/services/programService";
interface DashboardCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  glow: string;
  path: string;
}


export default function Dashboard(): JSX.Element {
  const [programCount, setProgramCount] = useState(0);

useEffect(() => {
  const loadPrograms = async () => {
    try {
      const res = await getPrograms();
      // Axios returns data in res.data
      setProgramCount(res?.data?.data?.length || 0);
    } catch (err) {
      console.error("Failed to load programs:", err);
    }
  };

  loadPrograms();
}, []);



  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const dashboardCards: DashboardCard[] = [
    {
      id: 1,
      title: "Program",
      description: "Manage academic programs and curriculum",
      icon: "📊",
      color: "from-blue-500 to-cyan-400",
      glow: "rgba(59, 130, 246, 0.18)",
      path: "/admin/programs",
    },
    {
      id: 2,
      title: "Class",
      description: "Handle class schedules and sections",
      icon: "🏫",
      color: "from-green-500 to-emerald-400",
      glow: "rgba(16, 185, 129, 0.18)",
      path: "/admin/classes",
    },
    {
      id: 3,
      title: "Room",
      description: "Manage classroom allocations and resources",
      icon: "🚪",
      color: "from-purple-500 to-pink-400",
      glow: "rgba(168, 85, 247, 0.18)",
      path: "/admin/rooms",
    },
    {
      id: 4,
      title: "Faculty",
      description: "Faculty management and assignments",
      icon: "👨‍🏫",
      color: "from-orange-500 to-amber-400",
      glow: "rgba(249, 115, 22, 0.18)",
      path: "/admin/faculty",
    },
    {
      id: 5,
      title: "Course",
      description: "Course catalog and subject management",
      icon: "📚",
      color: "from-red-500 to-rose-400",
      glow: "rgba(239, 68, 68, 0.18)",
      path: "/admin/courses",
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header Section */}
      <div className="text-center mb-12 relative">
        {/* Logout Button */}
        <div className="absolute top-0 right-0">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-lg transition-colors border border-red-500/30 text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Admin Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-slate-300 text-lg max-w-2xl mx-auto mb-2"
        >
          Manage your institution's academic resources and schedules
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-slate-400 text-md"
        >
          Welcome back, <span className="text-amber-400 font-semibold">{user?.username || "Admin"}</span>
        </motion.p>
      </div>

      {/* Statistics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 max-w-7xl mx-auto"
      >
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
          <div className="text-slate-400 text-sm">Total Programs</div>
          <div className="text-2xl font-bold text-white">{programCount}</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
          <div className="text-slate-400 text-sm">Active Faculty</div>
          <div className="text-2xl font-bold text-white">45</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
          <div className="text-slate-400 text-sm">Classes Today</div>
          <div className="text-2xl font-bold text-white">28</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
          <div className="text-slate-400 text-sm">Room Utilization</div>
          <div className="text-2xl font-bold text-white">78%</div>
        </div>
      </motion.div>

      {/* Main Dashboard Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto"
      >
        {dashboardCards.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ scale: 1.04, y: -6 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCardClick(card.path)}
            className="group cursor-pointer"
          >
            <div className="relative">
              {/* subtle glow background on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(45deg, ${card.glow}, transparent)`,
                  filter: "blur(16px)",
                  zIndex: 0,
                }}
              />
              <div
                className="relative rounded-2xl p-6 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 group-hover:border-slate-600/70 transition-all duration-300 overflow-hidden"
                style={{ zIndex: 1 }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{card.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                    Click to manage
                  </span>
                  <div className="text-slate-500 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300">
                    →
                  </div>
                </div>

                {/* subtle sweep effect using transform + opacity (keeps Tailwind safe) */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
                    transform: "translateX(-40%)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="text-center mt-12">
        <p className="text-slate-500 text-sm">Intelli-Schedule Admin Portal • SIH25091</p>
      </motion.div>
    </div>
  );
}
