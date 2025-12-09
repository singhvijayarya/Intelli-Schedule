// // src/pages/admin/Courses.tsx
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface Course {
//   id: string;
//   courseCode: string;
//   courseName: string;
//   credits: string;
//   duration: string;
//   department: string;
//   semester: string;
//   type: string;
//   prerequisites: string;
//   description: string;
//   fee: string;
//   status: 'Active' | 'Inactive';
// }

// interface FormData {
//   courseCode: string;
//   courseName: string;
//   credits: string;
//   duration: string;
//   department: string;
//   semester: string;
//   type: string;
//   prerequisites: string;
//   description: string;
//   fee: string;
//   status: 'Active' | 'Inactive';
// }

// interface StatCard {
//   title: string;
//   value: number;
//   color: string;
// }

// const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics', 'Commerce'];
// const courseTypes = ['Core', 'Elective', 'Lab', 'Project', 'Seminar', 'Workshop'];
// const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

// export default function Courses() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [editingCourse, setEditingCourse] = useState<Course | null>(null);
//   const [formData, setFormData] = useState<FormData>({
//     courseCode: '',
//     courseName: '',
//     credits: '',
//     duration: '',
//     department: '',
//     semester: '',
//     type: 'Core',
//     prerequisites: '',
//     description: '',
//     fee: '',
//     status: 'Active'
//   });

//   useEffect(() => {
//     const savedCourses = localStorage.getItem('intelli_courses');
//     if (savedCourses) {
//       try {
//         const parsedCourses = JSON.parse(savedCourses);
//         setCourses(parsedCourses);
//       } catch (error) {
//         console.error('Error parsing courses from localStorage:', error);
//         setCourses([]);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('intelli_courses', JSON.stringify(courses));
//   }, [courses]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingCourse) {
//       setCourses(courses.map(c => c.id === editingCourse.id ? 
//         { ...formData, id: editingCourse.id } : c
//       ));
//     } else {
//       setCourses([...courses, { ...formData, id: Date.now().toString() }]);
//     }
//     resetForm();
//   };

//   const resetForm = () => {
//     setShowModal(false);
//     setEditingCourse(null);
//     setFormData({
//       courseCode: '', courseName: '', credits: '', duration: '', department: '',
//       semester: '', type: 'Core', prerequisites: '', description: '', fee: '', status: 'Active'
//     });
//   };

//   const handleEdit = (course: Course) => {
//     setEditingCourse(course);
//     setFormData(course);
//     setShowModal(true);
//   };

//   const handleDelete = (id: string) => {
//     setCourses(courses.filter(c => c.id !== id));
//   };

//   const handleAssignFaculty = (course: Course) => {
//     console.log('Assign faculty to:', course.courseName);
//     // TODO: Implement faculty assignment logic
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const getTypeColor = (type: string): string => {
//     switch(type) {
//       case 'Core': return 'text-blue-400';
//       case 'Elective': return 'text-green-400';
//       case 'Lab': return 'text-purple-400';
//       case 'Project': return 'text-orange-400';
//       default: return 'text-slate-400';
//     }
//   };

//   const stats: StatCard[] = [
//     { title: 'Total Courses', value: courses.length, color: 'red' },
//     { title: 'Core Courses', value: courses.filter(c => c.type === 'Core').length, color: 'blue' },
//     { title: 'Elective Courses', value: courses.filter(c => c.type === 'Elective').length, color: 'green' },
//     { title: 'Departments', value: new Set(courses.map(c => c.department)).size, color: 'purple' }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-white">Course Management</h1>
//           <p className="text-slate-400">Course catalog and subject management</p>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setShowModal(true)}
//           className="bg-gradient-to-r from-red-500 to-rose-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all"
//         >
//           + Add Course
//         </motion.button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
//           >
//             <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
//             <div className="text-slate-400 text-sm">{stat.title}</div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Courses Grid */}
//       <motion.div 
//         className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
//         initial="hidden"
//         animate="visible"
//         transition={{ staggerChildren: 0.1 }}
//       >
//         {courses.map((course) => (
//           <motion.div
//             key={course.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileHover={{ scale: 1.02, y: -5 }}
//             className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-red-500/50 transition-all duration-300"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
//                   {course.courseName}
//                 </h3>
//                 <p className="text-red-400 text-sm">{course.courseCode}</p>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                 course.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
//               }`}>
//                 {course.status}
//               </span>
//             </div>

//             <div className="space-y-2 mb-4">
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Type:</span>
//                 <span className={`${getTypeColor(course.type)}`}>{course.type}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Credits:</span>
//                 <span className="text-white">{course.credits}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Department:</span>
//                 <span className="text-white">{course.department}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Semester:</span>
//                 <span className="text-white">{course.semester}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Duration:</span>
//                 <span className="text-white">{course.duration}</span>
//               </div>
//               {course.prerequisites && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-slate-400">Prerequisites:</span>
//                   <span className="text-white text-right max-w-[120px] truncate">{course.prerequisites}</span>
//                 </div>
//               )}
//               {course.fee && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-slate-400">Fee:</span>
//                   <span className="text-white">₹{course.fee}</span>
//                 </div>
//               )}
//             </div>

//             {course.description && (
//               <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
//             )}

//             {/* Action Buttons */}
//             <div className="flex gap-2">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleEdit(course)}
//                 className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
//               >
//                 Edit
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleAssignFaculty(course)}
//                 className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-colors"
//               >
//                 Faculty
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleDelete(course.id)}
//                 className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
//               >
//                 Delete
//               </motion.button>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Empty State */}
//       {courses.length === 0 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center py-12"
//         >
//           <div className="text-slate-400 text-lg mb-4">No courses created yet</div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowModal(true)}
//             className="bg-gradient-to-r from-red-500 to-rose-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all"
//           >
//             Create Your First Course
//           </motion.button>
//         </motion.div>
//       )}

//       {/* Add/Edit Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//             onClick={resetForm}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-2xl font-bold text-white mb-4">
//                 {editingCourse ? 'Edit Course' : 'Add New Course'}
//               </h2>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Course Code</label>
//                     <input
//                       type="text"
//                       name="courseCode"
//                       required
//                       value={formData.courseCode}
//                       onChange={handleInputChange}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Course Name</label>
//                     <input
//                       type="text"
//                       name="courseName"
//                       required
//                       value={formData.courseName}
//                       onChange={handleInputChange}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Credits</label>
//                     <input
//                       type="number"
//                       name="credits"
//                       required
//                       value={formData.credits}
//                       onChange={handleInputChange}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Duration</label>
//                     <input
//                       type="text"
//                       name="duration"
//                       required
//                       value={formData.duration}
//                       onChange={handleInputChange}
//                       placeholder="e.g., 15 weeks, 1 semester"
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Department</label>
//                     <select
//                       name="department"
//                       required
//                       value={formData.department}
//                       onChange={handleInputChange}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                     >
//                       <option value="" className="bg-slate-800">Select Department</option>
//                       {departments.map(dept => (
//                         <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Semester</label>
//                     <select
//                       name="semester"
//                       required
//                       value={formData.semester}
//                       onChange={handleInputChange}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                     >
//                       <option value="" className="bg-slate-800">Select Semester</option>
//                       {semesters.map(sem => (
//                         <option key={sem} value={sem} className="bg-slate-800">{sem}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Course Type</label>
//                     <select
//                       name="type"
//                       value={formData.type}
//                       onChange={handleInputChange}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                     >
//                       {courseTypes.map(type => (
//                         <option key={type} value={type} className="bg-slate-800">{type}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Course Fee</label>
//                     <input
//                       type="number"
//                       name="fee"
//                       value={formData.fee}
//                       onChange={handleInputChange}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-slate-300 text-sm mb-2 block">Prerequisites</label>
//                   <input
//                     type="text"
//                     name="prerequisites"
//                     value={formData.prerequisites}
//                     onChange={handleInputChange}
//                     placeholder="e.g., CS101, MATH201"
//                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-slate-300 text-sm mb-2 block">Description</label>
//                   <textarea
//                     name="description"
//                     rows={3}
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-slate-300 text-sm mb-2 block">Status</label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>

//                 <div className="flex gap-3 justify-end pt-4">
//                   <motion.button
//                     type="button"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={resetForm}
//                     className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     type="submit"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-red-500/25 transition-all"
//                   >
//                     {editingCourse ? 'Update Course' : 'Create Course'}
//                   </motion.button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


// src/pages/admin/Courses.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as coursesApi from '@/services/courseServices'; // <-- ensure this exists
import { toast } from 'sonner'; // optional: you have Sonner installed per earlier messages

interface Course {
  id: string;
  _id?: string;
  courseCode?: string;
  courseName?: string;
  credits?: number | string;
  duration?: string;
  department?: string;
  semester?: number | string;
  type?: string; // UI uses 'type'
  prerequisites?: string;
  description?: string;
  fee?: number | string;
  status?: 'Active' | 'Inactive';
}

interface FormData {
  courseCode: string;
  courseName: string;
  credits: string;
  duration: string;
  department: string;
  semester: string;
  type: string;
  prerequisites: string;
  description: string;
  fee: string;
  status: 'Active' | 'Inactive';
}

interface StatCard {
  title: string;
  value: number;
  color: string;
}

const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics', 'Commerce'];
const courseTypes = ['Core', 'Elective', 'Lab', 'Project', 'Seminar', 'Workshop'];
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<FormData>({
    courseCode: '',
    courseName: '',
    credits: '',
    duration: '',
    department: '',
    semester: '',
    type: 'Core',
    prerequisites: '',
    description: '',
    fee: '',
    status: 'Active'
  });

  // keep your original stats logic but use coursesArr later (safe)
  const coursesArr = Array.isArray(courses) ? courses : [];

  const getTypeColor = (type: string): string => {
    switch(type) {
      case 'Core': return 'text-blue-400';
      case 'Elective': return 'text-green-400';
      case 'Lab': return 'text-purple-400';
      case 'Project': return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  const stats: StatCard[] = [
    { title: 'Total Courses', value: coursesArr.length, color: 'red' },
    { title: 'Core Courses', value: coursesArr.filter(c => c.type === 'Core').length, color: 'blue' },
    { title: 'Elective Courses', value: coursesArr.filter(c => c.type === 'Elective').length, color: 'green' },
    { title: 'Departments', value: new Set(coursesArr.map(c => c.department)).size, color: 'purple' }
  ];

  // ---------- Backend integration ----------
  // Fetch courses (normalizes res.data.data and maps _id -> id)
  const fetchCourses = async () => {
    try {
      const res = await coursesApi.getAllCourses();
      // res.data.data is the array per your API contract
      const list =
        Array.isArray(res?.data?.data) ? res.data.data :
        Array.isArray(res?.data) ? res.data :
        Array.isArray(res?.data?.courses) ? res.data.courses :
        [];

      // normalize _id -> id so the UI expects course.id
      const normalized = list.map((c: any) => ({
        ...c,
        id: c._id || c.id || String(Math.random()).slice(2) // fallback id just in case
      }));

      setCourses(normalized);
    } catch (err: any) {
      // keep UI unchanged; set empty fallback
      console.error('Failed to fetch courses', err);
      setCourses([]);
      // optional: show toast only if sonner is available
      try { toast?.error?.(err?.response?.data?.message ?? 'Failed to load courses'); } catch {}
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // build payload from formData to send to backend
  const buildPayload = () => {
    // map UI type to backend enum-ish category (best-effort mapping)
    const mapTypeToCategory = (t: string) => {
      if (!t) return 'OTHER';
      const up = t.toUpperCase();
      if (up === 'CORE') return 'CORE';
      if (up === 'ELECTIVE') return 'ELECTIVE';
      if (up === 'PROJECT') return 'PROJECT';
      // Lab / Seminar / Workshop -> mark as OTHER to avoid validation issues
      return 'OTHER';
    };

    return {
      // If your backend requires programId, add it here:
      // programId: '<program-id>', // <-- add program selection to UI and set formData.programId
      semester: formData.semester ? Number(formData.semester) : undefined,
      category: mapTypeToCategory(formData.type),
      courseCode: formData.courseCode || undefined,
      courseName: formData.courseName,
      credits: formData.credits ? Number(formData.credits) : undefined,
      duration: formData.duration || undefined,
      department: formData.department || undefined,
      prerequisites: formData.prerequisites || undefined,
      description: formData.description || undefined,
      fee: formData.fee ? Number(formData.fee) : undefined,
      status: formData.status
    };
  };

  // Submit handler (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = buildPayload();

      if (editingCourse) {
        // editingCourse.id matches normalized id
        await coursesApi.updateCourse(editingCourse.id, payload);
        try { toast?.success?.('Course updated'); } catch {}
      } else {
        await coursesApi.createCourse(payload);
        try { toast?.success?.('Course created'); } catch {}
      }

      // refresh from backend (keeps UI identical)
      fetchCourses();
      resetForm();
    } catch (err: any) {
      console.error('Save failed', err);
      try { toast?.error?.(err?.response?.data?.message ?? 'Save failed'); } catch {}
    }
  };

  // Reset form
  const resetForm = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData({
      courseCode: '', courseName: '', credits: '', duration: '', department: '',
      semester: '', type: 'Core', prerequisites: '', description: '', fee: '', status: 'Active'
    });
  };

  // Edit
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.courseCode || '',
      courseName: course.courseName || '',
      credits: String(course.credits ?? ''),
      duration: course.duration || '',
      department: course.department || '',
      semester: String(course.semester ?? ''),
      type: course.type || 'Core',
      prerequisites: course.prerequisites || '',
      description: course.description || '',
      fee: String(course.fee ?? ''),
      status: course.status || 'Active'
    });
    setShowModal(true);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    try {
      await coursesApi.deleteCourse(id);
      try { toast?.success?.('Course deleted'); } catch {}
      // remove locally for faster UX, but also re-fetch to keep consistent
      setCourses(prev => prev.filter(c => c.id !== id));
      // optionally refresh
      fetchCourses();
    } catch (err: any) {
      console.error('Delete failed', err);
      try { toast?.error?.(err?.response?.data?.message ?? 'Delete failed'); } catch {}
    }
  };

  // assign faculty placeholder
  const handleAssignFaculty = (course: Course) => {
    console.log('Assign faculty to:', course.courseName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ---------- UI (exactly your original markup; only uses coursesArr instead of courses) ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Course Management</h1>
          <p className="text-slate-400">Course catalog and subject management</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-red-500 to-rose-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all"
        >
          + Add Course
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

      {/* Courses Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        {coursesArr.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-red-500/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                  {course.courseName}
                </h3>
                <p className="text-red-400 text-sm">{course.courseCode}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                course.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {course.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Type:</span>
                <span className={`${getTypeColor(course.type || '')}`}>{course.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Credits:</span>
                <span className="text-white">{course.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Department:</span>
                <span className="text-white">{course.department}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Semester:</span>
                <span className="text-white">{course.semester}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Duration:</span>
                <span className="text-white">{course.duration}</span>
              </div>
              {course.prerequisites && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Prerequisites:</span>
                  <span className="text-white text-right max-w-[120px] truncate">{course.prerequisites}</span>
                </div>
              )}
              {course.fee && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fee:</span>
                  <span className="text-white">₹{course.fee}</span>
                </div>
              )}
            </div>

            {course.description && (
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(course)}
                className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
              >
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAssignFaculty(course)}
                className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-colors"
              >
                Faculty
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(course.id)}
                className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {coursesArr.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-slate-400 text-lg mb-4">No courses created yet</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-red-500 to-rose-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all"
          >
            Create Your First Course
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
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Course Code</label>
                    <input
                      type="text"
                      name="courseCode"
                      required
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Course Name</label>
                    <input
                      type="text"
                      name="courseName"
                      required
                      value={formData.courseName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Credits</label>
                    <input
                      type="number"
                      name="credits"
                      required
                      value={formData.credits}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      required
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 15 weeks, 1 semester"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Department</label>
                    <select
                      name="department"
                      required
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-slate-800">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Semester</label>
                    <select
                      name="semester"
                      required
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-slate-800">Select Semester</option>
                      {semesters.map(sem => (
                        <option key={sem} value={sem} className="bg-slate-800">{sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Course Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                    >
                      {courseTypes.map(type => (
                        <option key={type} value={type} className="bg-slate-800">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Course Fee</label>
                    <input
                      type="number"
                      name="fee"
                      value={formData.fee}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Prerequisites</label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    placeholder="e.g., CS101, MATH201"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
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
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-red-500/25 transition-all"
                  >
                    {editingCourse ? 'Update Course' : 'Create Course'}
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
