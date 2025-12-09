// // src/pages/admin/Programs.jsx
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function Programs() {
//   const [programs, setPrograms] = useState([]);
//   const [courses, setCourses] = useState([]); // Added courses state
//   const [showModal, setShowModal] = useState(false);
//   const [editingProgram, setEditingProgram] = useState(null);
//   // vansh
//   // const [formData, setFormData] = useState({
//   //   name: '',
//   //   code: '',
//   //   duration: '',
//   //   credits: '',
//   //   description: '',
//   //   fees: '',
//   //   requirements: '',
//   //   status: 'Active',
//   //   courseIds: [] // Added course relationships
//   // });
//   const [formData, setFormData] = useState({
//   code: '',
//   name: '',
//   type: 'FYUP',           // or '' — default value for the select
//   durationYears: '',      // number input
//   totalSemesters: '',     // number input
//   department: '',
//   status: 'Active',       // keep the select, map to isActive when sending
//   courseIds: []           // (optional) keep if you still want relationships
// });


//   // Load programs AND courses from localStorage
//   useEffect(() => {
//     const savedPrograms = localStorage.getItem('intelli_programs');
//     const savedCourses = localStorage.getItem('intelli_courses');
    
//     if (savedPrograms) setPrograms(JSON.parse(savedPrograms));
//     if (savedCourses) setCourses(JSON.parse(savedCourses));
//   }, []);

//   // Save programs to localStorage
//   useEffect(() => {
//     localStorage.setItem('intelli_programs', JSON.stringify(programs));
//   }, [programs]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editingProgram) {
//       setPrograms(programs.map(p => p.id === editingProgram.id ? 
//         { ...formData, id: editingProgram.id } : p
//       ));
//     } else {
//       setPrograms([...programs, { ...formData, id: Date.now().toString() }]);
//     }
//     setShowModal(false);
//     setEditingProgram(null);
//     setFormData({
//       name: '', code: '', duration: '', credits: '', description: '', 
//       fees: '', requirements: '', status: 'Active', courseIds: []
//     });
//   };

//   // const handleEdit = (program) => {
//   //   setEditingProgram(program);
//   //   setFormData(program);
//   //   setShowModal(true);
//   // };
//   const handleEdit = (program) => {
//   setEditingProgram(program);
//   setFormData({
//     code: program.code || '',
//     name: program.name || '',
//     type: program.type || '',
//     durationYears: program.durationYears ?? program.duration ?? '',
//     totalSemesters: program.totalSemesters ?? '',
//     department: program.department || '',
//     status: program.isActive ? 'Active' : 'Inactive',
//     courseIds: program.courseIds?.map(id => id.toString()) ?? []
//   });
//   setShowModal(true);
// };


//   const handleDelete = (id) => {
//     setPrograms(programs.filter(p => p.id !== id));
//   };

//   const handleAssignCourses = (program) => {
//     // Implementation for course assignment modal
//     console.log('Assign courses to:', program.name);
//   };

//   // Get courses assigned to a program
//   const getAssignedCourses = (program) => {
//     return courses.filter(course => program.courseIds?.includes(course.id));
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-white">Program Management</h1>
//           <p className="text-slate-400">Manage academic programs and curriculum</p>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setShowModal(true)}
//           className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all"
//         >
//           + Add Program
//         </motion.button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         {[
//           { title: 'Total Programs', value: programs.length, color: 'blue' },
//           { title: 'Active Programs', value: programs.filter(p => p.status === 'Active').length, color: 'green' },
//           { title: 'Inactive Programs', value: programs.filter(p => p.status === 'Inactive').length, color: 'red' },
//           { title: 'Courses Assigned', value: programs.reduce((sum, p) => sum + (p.courseIds?.length || 0), 0), color: 'purple' }
//         ].map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
//           >
//             <div className={`text-2xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
//             <div className="text-slate-400 text-sm">{stat.title}</div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Programs Grid */}
//       <motion.div 
//         className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         transition={{ staggerChildren: 0.1 }}
//       >
//         {programs.map((program) => {
//           const assignedCourses = getAssignedCourses(program);
          
//           return (
//           <motion.div
//             key={program.id}
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, y: -5 }}
//             className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
//                   {program.name}
//                 </h3>
//                 <p className="text-blue-400 text-sm">{program.code}</p>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                 program.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
//               }`}>
//                 {program.status}
//               </span>
//             </div>

//             <div className="space-y-2 mb-4">
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Duration:</span>
//                 <span className="text-white">{program.duration}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Credits:</span>
//                 <span className="text-white">{program.credits}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Fees:</span>
//                 <span className="text-white">${program.fees}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Courses:</span>
//                 <span className="text-white">{assignedCourses.length} assigned</span>
//               </div>
//             </div>

//             {/* Assigned Courses Preview */}
//             {assignedCourses.length > 0 && (
//               <div className="mb-4">
//                 <div className="text-slate-400 text-sm mb-2">Assigned Courses:</div>
//                 <div className="flex flex-wrap gap-1">
//                   {assignedCourses.slice(0, 3).map(course => (
//                     <span key={course.id} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
//                       {course.courseCode}
//                     </span>
//                   ))}
//                   {assignedCourses.length > 3 && (
//                     <span className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded text-xs">
//                       +{assignedCourses.length - 3} more
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             <p className="text-slate-400 text-sm mb-4 line-clamp-2">{program.description}</p>

//             {/* Action Buttons */}
//             <div className="flex gap-2">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleEdit(program)}
//                 className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition-colors"
//               >
//                 Edit
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleAssignCourses(program)}
//                 className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-colors"
//               >
//                 Courses
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleDelete(program.id)}
//                 className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
//               >
//                 Delete
//               </motion.button>
//             </div>
//           </motion.div>
//         )})}
//       </motion.div>

//       {/* Add/Edit Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto"
//             >
//               <h2 className="text-2xl font-bold text-white mb-4">
//                 {editingProgram ? 'Edit Program' : 'Add New Program'}
//               </h2>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Program Name</label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.name}
//                       onChange={(e) => setFormData({...formData, name: e.target.value})}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Program Code</label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.code}
//                       onChange={(e) => setFormData({...formData, code: e.target.value})}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Duration</label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.duration}
//                       onChange={(e) => setFormData({...formData, duration: e.target.value})}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-slate-300 text-sm mb-2 block">Total Credits</label>
//                     <input
//                       type="number"
//                       required
//                       value={formData.credits}
//                       onChange={(e) => setFormData({...formData, credits: e.target.value})}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                 </div>

//                 {/* <div>
//                   <label className="text-slate-300 text-sm mb-2 block">Fees</label>
//                   <input
//                     type="number"
//                     required
//                     value={formData.fees}
//                     onChange={(e) => setFormData({...formData, fees: e.target.value})}
//                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
//                   />
//                 </div> */}

//                 {/* NEW: Course Assignment */}
//                 <div>
//                   <label className="text-slate-300 text-sm mb-2 block">Assign Courses</label>
//                   <select
//                     multiple
//                     value={formData.courseIds || []}
//                     onChange={(e) => {
//                       const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
//                       setFormData({...formData, courseIds: selectedOptions});
//                     }}
//                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors h-32"
//                   >
//                     <option value="" disabled className="bg-slate-800">Select courses (Hold Ctrl for multiple)</option>
//                     {courses.map(course => (
//                       <option key={course.id} value={course.id} className="bg-slate-800">
//                         {course.courseCode} - {course.courseName}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="text-slate-400 text-xs mt-1">
//                     Hold Ctrl/Cmd to select multiple courses
//                   </div>
//                 </div>

//                 {/* <div>
//                   <label className="text-slate-300 text-sm mb-2 block">Description</label>
//                   <textarea
//                     rows="3"
//                     value={formData.description}
//                     onChange={(e) => setFormData({...formData, description: e.target.value})}
//                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
//                   />
//                 </div> */}

//                 {/* <div>
//                   <label className="text-slate-300 text-sm mb-2 block">Requirements</label>
//                   <textarea
//                     rows="2"
//                     value={formData.requirements}
//                     onChange={(e) => setFormData({...formData, requirements: e.target.value})}
//                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
//                   />
//                 </div> */}

//                 <div>
//                   <label className="text-slate-300 text-sm mb-2 block">Status</label>
//                   <select
//                     value={formData.status}
//                     onChange={(e) => setFormData({...formData, status: e.target.value})}
//                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
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
//                     onClick={() => {
//                       setShowModal(false);
//                       setEditingProgram(null);
//                       setFormData({
//                         name: '', code: '', duration: '', credits: '', description: '', 
//                         fees: '', requirements: '', status: 'Active', courseIds: []
//                       });
//                     }}
//                     className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     type="submit"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-blue-500/25 transition-all"
//                   >
//                     {editingProgram ? 'Update Program' : 'Create Program'}
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




// src/pages/admin/Programs.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPrograms,
  getCourses,
  createProgram,
  updateProgram,
  deleteProgram
} from "@/services/programService";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    duration: "",
    credits: "",
    description: "",
    fees: "",
    requirements: "",
    status: "Active",
    courseIds: []
  });
  const [error, setError] = useState(null);

  // Load programs and courses from backend
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([getPrograms(), getCourses()]);
        // adapt to your backend response shape: assume { data: { data: [...] } } OR { data: [...] }
        const programsData = pRes.data?.data ?? pRes.data ?? [];
        const coursesData = cRes.data?.data ?? cRes.data ?? [];
        // normalize ids to string for UI selection
        setPrograms(programsData.map(p => ({ ...p, id: p._id ?? p.id })));
        setCourses(coursesData.map(c => ({ ...c, id: c._id ?? c.id })));
      } catch (err) {
        console.error("Failed to load programs or courses", err);
        setError("Failed to load programs/courses. Check server or CORS.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // helper: convert frontend form -> backend payload
  const preparePayload = (fd) => {
    return {
      code: fd.code,
      name: fd.name,
      // try to convert duration to number
      durationYears: Number(fd.duration) || undefined,
      credits: Number(fd.credits) || undefined,
      description: fd.description,
      fees: Number(fd.fees) || undefined,
      requirements: fd.requirements,
      isActive: fd.status === "Active",
      courseIds: fd.courseIds || []
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = preparePayload(formData);

    try {
      setLoading(true);
      if (editingProgram) {
        // update
        const res = await updateProgram(editingProgram.id, payload);
        const updated = res.data?.data ?? res.data;
        // update local state (normalize id)
        setPrograms(prev => prev.map(p => p.id === editingProgram.id ? ({ ...p, ...updated, id: updated._id ?? updated.id ?? editingProgram.id }) : p));
      } else {
        // create
        const res = await createProgram(payload);
        const created = res.data?.data ?? res.data;
        // push new program into state (normalize id)
        setPrograms(prev => [{ ...created, id: created._id ?? created.id ?? Date.now().toString() }, ...prev]);
      }

      // reset form/modal
      setShowModal(false);
      setEditingProgram(null);
      setFormData({ name: "", code: "", duration: "", credits: "", description: "", fees: "", requirements: "", status: "Active", courseIds: [] });
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Failed to save program");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (program) => {
    // map program backend fields to form fields
    setEditingProgram(program);
    setFormData({
      name: program.name || "",
      code: program.code || "",
      duration: program.durationYears ?? program.duration ?? "",
      credits: program.credits ?? "",
      description: program.description ?? "",
      fees: program.fees ?? "",
      requirements: program.requirements ?? "",
      status: program.isActive ? "Active" : "Inactive",
      courseIds: program.courseIds?.map(id => id.toString()) ?? []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program? This cannot be undone.")) return;
    try {
      // optimistic UI removal
      const prev = [...programs];
      setPrograms(prev.filter(p => p.id !== id));
      await deleteProgram(id);
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete program");
      // optionally reload programs from server or revert (not implemented here)
    }
  };

  const handleAssignCourses = (program) => {
    // you can open a separate modal to manage course assignment,
    // or reuse the edit modal where courseIds is editable.
    handleEdit(program);
  };

  const getAssignedCourses = (program) => {
    return courses.filter(course => (program.courseIds ?? []).includes(course.id) || (program.courseIds ?? []).includes(course._id));
  };

  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Program Management</h1>
          <p className="text-slate-400">Manage academic programs and curriculum</p>
        </div>
        <motion.button onClick={() => setShowModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all">
          + Add Program
        </motion.button>
      </div>

      {error && <div className="mb-4 text-red-400">{error}</div>}
      {loading && <div className="mb-4 text-slate-400">Loading...</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Programs", value: programs.length, color: "blue" },
          { title: "Active Programs", value: programs.filter(p => p.isActive || p.status === "Active").length, color: "green" },
          { title: "Inactive Programs", value: programs.filter(p => !(p.isActive || p.status === "Active")).length, color: "red" },
          { title: "Courses Assigned", value: programs.reduce((sum, p) => sum + (p.courseIds?.length || 0), 0), color: "purple" }
        ].map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className={`text-2xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Programs Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" variants={cardVariants} initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
        {programs.map((program) => {
          const assignedCourses = getAssignedCourses(program);
          return (
            <motion.div key={program.id} variants={cardVariants} whileHover={{ scale: 1.02, y: -5 }} className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{program.name}</h3>
                  <p className="text-blue-400 text-sm">{program.code}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${program.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {program.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Duration:</span><span className="text-white">{program.durationYears ?? program.duration ?? "-"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Credits:</span><span className="text-white">{program.credits ?? "-"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Fees:</span><span className="text-white">{program.fees ? `$${program.fees}` : "-"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Courses:</span><span className="text-white">{assignedCourses.length} assigned</span></div>
              </div>

              {assignedCourses.length > 0 && (
                <div className="mb-4">
                  <div className="text-slate-400 text-sm mb-2">Assigned Courses:</div>
                  <div className="flex flex-wrap gap-1">
                    {assignedCourses.slice(0, 3).map(course => <span key={course.id} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">{course.courseCode || course.code}</span>)}
                    {assignedCourses.length > 3 && <span className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded text-xs">+{assignedCourses.length - 3} more</span>}
                  </div>
                </div>
              )}

              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{program.description}</p>

              <div className="flex gap-2">
                <motion.button onClick={() => handleEdit(program)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition-colors">Edit</motion.button>
                <motion.button onClick={() => handleAssignCourses(program)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-colors">Courses</motion.button>
                <motion.button onClick={() => handleDelete(program.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors">Delete</motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">{editingProgram ? "Edit Program" : "Add New Program"}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Program Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Program Code</label>
                    <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Duration (years)</label>
                    <input type="number" required value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">Total Credits</label>
                    <input type="number" required value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Fees</label>
                  <input type="number" required value={formData.fees} onChange={(e) => setFormData({ ...formData, fees: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Assign Courses</label>
                  <select multiple value={formData.courseIds || []} onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({ ...formData, courseIds: selectedOptions });
                  }} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors h-32">
                    <option value="" disabled className="bg-slate-800">Select courses (Hold Ctrl for multiple)</option>
                    {courses.map(course => <option key={course.id} value={course.id} className="bg-slate-800">{course.courseCode || course.code} - {course.courseName || course.name}</option>)}
                  </select>
                  <div className="text-slate-400 text-xs mt-1">Hold Ctrl/Cmd to select multiple courses</div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Requirements</label>
                  <textarea rows={2} value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowModal(false); setEditingProgram(null); setFormData({ name: "", code: "", duration: "", credits: "", description: "", fees: "", requirements: "", status: "Active", courseIds: [] }); }} className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors">
                    Cancel
                  </motion.button>
                  <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-blue-500/25 transition-all">
                    {editingProgram ? "Update Program" : "Create Program"}
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
