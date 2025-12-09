// src/pages/admin/Rooms.tsx
import React, { useState, useEffect } from 'react';
import * as roomService from '@/services/roomService';
import { motion, AnimatePresence } from 'framer-motion';
import { fromApi, toApi } from '@/utils/roomMappers';
import { UiRoom } from '@/utils/roomMappers';

interface Room {
  
  id: string;              // maps from _id
  roomNumber: string;      // optional, you may store in notes or name
  roomName: string;        // maps to name
  capacity: string;        // string in UI, convert to number
  roomType: string;        // maps to type (convert names)
  equipment: string;       // comma separated string -> features[]
  building: string;
  floor: string;
  availability?: string;   // local UI-only
  maintenanceSchedule?: string; // local UI-only

}

interface FormData {
  roomNumber: string;
  roomName: string;
  capacity: string;
  roomType: string;
  equipment: string;
  building: string;
  floor: string;
  availability: string;
  maintenanceSchedule: string;
}

interface StatCard {
  title: string;
  value: number;
  color: string;
}

const roomTypes = ['Classroom', 'Lab', 'Auditorium', 'Conference Room', 'Computer Lab', 'Science Lab', 'Library', 'Sports Room'];
const availabilityStatus = ['Available', 'Occupied', 'Maintenance', 'Reserved'];

// Sample data for initial setup
const sampleRooms: Room[] = [
  {
    id: '1',
    roomNumber: '101',
    roomName: 'Computer Lab A',
    capacity: '40',
    roomType: 'Computer Lab',
    equipment: 'Computers, Projector, Whiteboard',
    building: 'Main Building',
    floor: '1',
    availability: 'Available',
    maintenanceSchedule: 'Monthly'
  },
  {
    id: '2',
    roomNumber: '201',
    roomName: 'Lecture Hall B',
    capacity: '60', 
    roomType: 'Classroom',
    equipment: 'Projector, AC, Whiteboard',
    building: 'Main Building',
    floor: '2',
    availability: 'Available',
    maintenanceSchedule: 'Quarterly'
  },
  {
    id: '3',
    roomNumber: '301',
    roomName: 'Science Lab',
    capacity: '30',
    roomType: 'Science Lab',
    equipment: 'Microscopes, Chemicals, Safety Equipment',
    building: 'Science Block',
    floor: '3',
    availability: 'Available',
    maintenanceSchedule: 'Weekly'
  }
];

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    roomNumber: '',
    roomName: '',
    capacity: '',
    roomType: 'Classroom',
    equipment: '',
    building: '',
    floor: '',
    availability: 'Available',
    maintenanceSchedule: ''
  });

  useEffect(() => {
  let mounted = true;
  const fetchRooms = async () => {
    try {
      setLoading(true); // add loading state if not present: const [loading,setLoading]=useState(false)
      const apiRooms = await roomService.getRooms(); // ApiRoom[]
      const uiRooms: UiRoom[] = apiRooms.map(fromApi);
      if (!mounted) return;
      // set rooms with server data
      setRooms(uiRooms);
      // optional: update localStorage cache (if you want offline fallback)
      try {
        localStorage.setItem("intelli_rooms", JSON.stringify(uiRooms));
      } catch (e) {
        // ignore localStorage write errors
      }
    } catch (err) {
      console.error("Failed to fetch rooms from API:", err);
      // fallback: attempt to load cache if available
      const cached = localStorage.getItem("intelli_rooms");
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as UiRoom[];
          if (mounted) setRooms(parsed);
        } catch {}
      } 
    } finally {
      if (mounted) setLoading(false);
    }
  };

  fetchRooms();
  return () => { mounted = false; };
}, []); // run once on mount

  useEffect(() => {
    localStorage.setItem('intelli_rooms', JSON.stringify(rooms));
  }, [rooms]);

  // Search functionality
  const filteredRooms = rooms.filter(r =>
    r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (editingRoom) {
  //     setRooms(rooms.map(r => r.id === editingRoom.id ? 
  //       { ...formData, id: editingRoom.id } : r
  //     ));
  //   } else {
  //     setRooms([...rooms, { ...formData, id: Date.now().toString() }]);
  //   }
  //   resetForm();
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        const payload = toApi({ ...formData, id: editingRoom.id } as UiRoom);
        const updated = await roomService.updateRoom(editingRoom.id, payload);
        setRooms(prev => prev.map(r => r.id === editingRoom.id ? fromApi(updated) : r));
      } else {
        const payload = toApi(formData as UiRoom);
        const created = await roomService.createRoom(payload);
        setRooms(prev => [...prev, fromApi(created)]);
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to save room");
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingRoom(null);
    setFormData({
      roomNumber: '', roomName: '', capacity: '', roomType: 'Classroom',
      equipment: '', building: '', floor: '', availability: 'Available', maintenanceSchedule: ''
    });
  };

   const handleDelete = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    try {
      await roomService.deleteRoom(id);
      setRooms(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to delete room");
    }
  };

  const handleEdit = (room: UiRoom) => {
    setEditingRoom(room);
    setFormData(room as unknown as FormData); // still safe if fields align
    setShowModal(true);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'Available': return 'bg-green-500/20 text-green-400';
      case 'Occupied': return 'bg-blue-500/20 text-blue-400';
      case 'Maintenance': return 'bg-red-500/20 text-red-400';
      case 'Reserved': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeColor = (type: string): string => {
    switch(type) {
      case 'Lab': return 'text-purple-400';
      case 'Auditorium': return 'text-yellow-400';
      case 'Computer Lab': return 'text-cyan-400';
      case 'Science Lab': return 'text-pink-400';
      default: return 'text-slate-400';
    }
  };
//   const filteredRooms = rooms.filter(r =>
//   r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   r.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   r.building.toLowerCase().includes(searchTerm.toLowerCase())
// );
  const stats: StatCard[] = [
    { title: 'Total Rooms', value: filteredRooms.length, color: 'purple' },
    { title: 'Available Rooms', value: filteredRooms.filter(r => r.availability === 'Available').length, color: 'green' },
    { title: 'Under Maintenance', value: filteredRooms.filter(r => r.availability === 'Maintenance').length, color: 'red' },
    { title: 'Total Capacity', value: filteredRooms.reduce((sum, r) => sum + parseInt(r.capacity || '0'), 0), color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Room Management</h1>
          <p className="text-slate-400">Manage classroom allocations and resources</p>
        </div>
        <div className="flex gap-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none w-64"
            />
            <span className="absolute right-3 top-2 text-slate-400">🔍</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            + Add Room
          </motion.button>
        </div>
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

      {/* Rooms Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        {filteredRooms.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {room.roomName}
                </h3>
                <p className="text-purple-400 text-sm">Room {room.roomNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.availability)}`}>
                {room.availability}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Type:</span>
                <span className={`${getTypeColor(room.roomType)}`}>{room.roomType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Capacity:</span>
                <span className="text-white">{room.capacity} students</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Building:</span>
                <span className="text-white">{room.building}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Floor:</span>
                <span className="text-white">{room.floor}</span>
              </div>
              {room.equipment && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Equipment:</span>
                  <span className="text-white text-right max-w-[120px] truncate">{room.equipment}</span>
                </div>
              )}
              {room.maintenanceSchedule && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Maintenance:</span>
                  <span className="text-white">{room.maintenanceSchedule}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(room)}
                className="flex-1 bg-purple-500/20 text-purple-400 py-2 rounded-lg text-sm font-semibold hover:bg-purple-500/30 transition-colors"
              >
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(room.id)}
                className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredRooms.length === 0 && rooms.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-slate-400 text-lg mb-4">No rooms found matching your search</div>
        </motion.div>
      )}

      {rooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-slate-400 text-lg mb-4">No rooms created yet</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            Create Your First Room
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
              className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Room Number</label>
                    <input
                      type="text"
                      name="roomNumber"
                      required
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Room Name</label>
                    <input
                      type="text"
                      name="roomName"
                      required
                      value={formData.roomName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Room Type</label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {roomTypes.map(type => (
                        <option key={type} value={type} className="bg-slate-800">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Building</label>
                    <input
                      type="text"
                      name="building"
                      required
                      value={formData.building}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Floor</label>
                    <input
                      type="text"
                      name="floor"
                      required
                      value={formData.floor}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Equipment/Facilities</label>
                  <textarea
                    name="equipment"
                    rows={2}
                    value={formData.equipment}
                    onChange={handleInputChange}
                    placeholder="Projector, Whiteboard, AC, etc."
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Availability Status</label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {availabilityStatus.map(status => (
                        <option key={status} value={status} className="bg-slate-800">{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Maintenance Schedule</label>
                    <input
                      type="text"
                      name="maintenanceSchedule"
                      value={formData.maintenanceSchedule}
                      onChange={handleInputChange}
                      placeholder="e.g., Monthly, Quarterly, etc."
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
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
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    {editingRoom ? 'Update Room' : 'Create Room'}
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