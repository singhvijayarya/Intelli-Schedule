// src/pages/admin/Classes.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClassItem {
  id: string;
  className: string;
  section: string;
  capacity: string;
  grade: string;
  teacher: string;
  schedule: string;
  room: string;
  status: 'Active' | 'Inactive';
}

interface FormData {
  className: string;
  section: string;
  capacity: string;
  grade: string;
  teacher: string;
  schedule: string;
  room: string;
  status: 'Active' | 'Inactive';
}

interface StatCard {
  title: string;
  value: number;
  color: string;
}

export default function Classes() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    className: '',
    section: '',
    capacity: '',
    grade: '',
    teacher: '',
    schedule: '',
    room: '',
    status: 'Active'
  });

  useEffect(() => {
    const savedClasses = localStorage.getItem('intelli_classes');
    if (savedClasses) {
      try {
        const parsedClasses = JSON.parse(savedClasses);
        setClasses(parsedClasses);
      } catch (error) {
        console.error('Error parsing classes from localStorage:', error);
        setClasses([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('intelli_classes', JSON.stringify(classes));
  }, [classes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      setClasses(classes.map(c => c.id === editingClass.id ? 
        { ...formData, id: editingClass.id } : c
      ));
    } else {
      setClasses([...classes, { ...formData, id: Date.now().toString() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({
      className: '', section: '', capacity: '', grade: '', 
      teacher: '', schedule: '', room: '', status: 'Active'
    });
  };

  const handleEdit = (cls: ClassItem) => {
    setEditingClass(cls);
    setFormData(cls);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const stats: StatCard[] = [
    { title: 'Total Classes', value: classes.length, color: 'green' },
    { title: 'Active Classes', value: classes.filter(c => c.status === 'Active').length, color: 'blue' },
    { title: 'Total Capacity', value: classes.reduce((sum, c) => sum + parseInt(c.capacity || '0'), 0), color: 'purple' },
    { title: 'Sections', value: new Set(classes.map(c => c.section)).size, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Class Management</h1>
          <p className="text-slate-400">Handle class schedules and sections</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all"
        >
          + Add Class
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Classes Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        {classes.map((cls) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">
                  {cls.className}
                </h3>
                <p className="text-green-400 text-sm">Section {cls.section}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                cls.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {cls.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Grade:</span>
                <span className="text-white">{cls.grade}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Capacity:</span>
                <span className="text-white">{cls.capacity} students</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Teacher:</span>
                <span className="text-white">{cls.teacher}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Schedule:</span>
                <span className="text-white">{cls.schedule}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Room:</span>
                <span className="text-white">{cls.room}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(cls)}
                className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-colors"
              >
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(cls.id)}
                className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {classes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-slate-400 text-lg mb-4">No classes created yet</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all"
          >
            Create Your First Class
          </motion.button>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Class Name</label>
                    <input
                      type="text"
                      name="className"
                      required
                      value={formData.className}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Section</label>
                    <input
                      type="text"
                      name="section"
                      required
                      value={formData.section}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Grade Level</label>
                    <input
                      type="text"
                      name="grade"
                      required
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      required
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Teacher</label>
                    <input
                      type="text"
                      name="teacher"
                      required
                      value={formData.teacher}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Room</label>
                    <input
                      type="text"
                      name="room"
                      required
                      value={formData.room}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Schedule</label>
                  <input
                    type="text"
                    name="schedule"
                    required
                    value={formData.schedule}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Wed-Fri 9:00-10:00"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetForm}
                    className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    {editingClass ? 'Update Class' : 'Create Class'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}