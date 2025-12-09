// src/App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";


// Pages
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import TimetableGenerator from "@/pages/TimetableGenerator";
import NotFound from "@/pages/NotFound";

// Role pages
import StudentDashboard from "@/pages/Student/Dashboard";

import FacultyDashboard from "@/pages/Faculty/Dashboard";
import FacultyMyTimeTable from "@/pages/Faculty/MyTimetable";
import FacultyAvailability from "@/pages/Faculty/Availability";

import AdminDashboard from "@/pages/Admin/Dashboard";
import AdminClasses from "@/pages/Admin/classes";
import AdminPrograms from "@/pages/Admin/Programs";
import AdminRooms from "@/pages/Admin/Rooms";
import AdminCourses from "@/pages/Admin/Courses";

const queryClient = new QueryClient();

// Redirect authenticated users away from login/register
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated , loading } = useAuth();

  if ( loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

// Simple placeholder pages for header links
const ProductPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-20 px-4">
    <h1 className="text-3xl font-bold mb-4">Product</h1>
    <p className="text-muted-foreground">Overview of Timetable Weaver product features coming soon.</p>
  </div>
);

const PricingPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-20 px-4">
    <h1 className="text-3xl font-bold mb-4">Pricing</h1>
    <p className="text-muted-foreground">Pricing plans and tiers will be displayed here.</p>
  </div>
);

const DocumentationPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-20 px-4">
    <h1 className="text-3xl font-bold mb-4">Documentation</h1>
    <p className="text-muted-foreground">User guides and API docs will be available here.</p>
  </div>
);

const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-20 px-4">
    <h1 className="text-3xl font-bold mb-4">About</h1>
    <p className="text-muted-foreground">About Timetable Weaver — mission, team and contact info.</p>
  </div>
);

// Placeholder components for missing files
const StudentMyTimeTable: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
    <div className="max-w-4xl mx-auto text-center py-20">
      <h1 className="text-4xl font-bold text-white mb-4">Student Timetable</h1>
      <p className="text-slate-300 text-lg">Student timetable view coming soon</p>
    </div>
  </div>
);

const AdminFaculty: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-6">
    <div className="max-w-4xl mx-auto text-center py-20">
      <h1 className="text-4xl font-bold text-white mb-4">Faculty Management</h1>
      <p className="text-slate-300 text-lg">Faculty management system coming soon</p>
    </div>
  </div>
);

/**
 * DashboardRedirect component:
 * Redirects /dashboard to role-specific dashboards after auth check
 */
const DashboardRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const role = (user.role || "").toLowerCase();
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "faculty") navigate("/faculty/dashboard");
    else navigate("/student/dashboard");
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-white text-xl">Redirecting to your dashboard...</div>
    </div>
  );
};

/**
 * TimetableRedirect component:
 * Redirects /my-timetable to role-specific timetable pages
 */
const TimetableRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const role = (user.role || "").toLowerCase();
    if (role === "faculty") navigate("/faculty/my-timetable");
    else navigate("/student/my-timetable");
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-white text-xl">Redirecting to your timetable...</div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />

      {/* Login and Register as public routes (redirects if already authenticated) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Header pages (public) */}
      <Route path="/product" element={<ProductPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Dashboard redirect (keeps /dashboard stable) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* Student routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-timetable"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentMyTimeTable />
          </ProtectedRoute>
        }
      />

      {/* Faculty routes */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Faculty"]}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/my-timetable"
        element={
          <ProtectedRoute allowedRoles={["Faculty"]}>
            <FacultyMyTimeTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/availability"
        element={
          <ProtectedRoute allowedRoles={["Faculty"]}>
            <FacultyAvailability />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/classes"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/programs"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminPrograms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminRooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faculty"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminFaculty />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminCourses />
          </ProtectedRoute>
        }
      />

      {/* Timetable generator (Admin) */}
      <Route
        path="/timetable-generator"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <TimetableGenerator />
          </ProtectedRoute>
        }
      />

      {/* Shared timetable redirect */}
      <Route
        path="/my-timetable"
        element={
          <ProtectedRoute allowedRoles={["Faculty", "Student"]}>
            <TimetableRedirect />
          </ProtectedRoute>
        }
      />

      {/* Faculty-specific routes */}
      <Route
        path="/availability"
        element={
          <ProtectedRoute allowedRoles={["Faculty"]}>
            <FacultyAvailability />
          </ProtectedRoute>
        }
      />

      {/* Student-specific routes */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
              <div className="max-w-4xl mx-auto text-center py-20">
                <h1 className="text-4xl font-bold text-white mb-4">My Courses</h1>
                <p className="text-slate-300 text-lg">Course view coming soon</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Common protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
              <div className="max-w-4xl mx-auto text-center py-20">
                <h1 className="text-4xl font-bold text-white mb-4">Profile</h1>
                <p className="text-slate-300 text-lg">Profile settings coming soon</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
              <div className="max-w-4xl mx-auto text-center py-20">
                <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
                <p className="text-slate-300 text-lg">Settings coming soon</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
              <div className="max-w-4xl mx-auto text-center py-20">
                <h1 className="text-4xl font-bold text-white mb-4">Help & Guidelines</h1>
                <p className="text-slate-300 text-lg">Help documentation coming soon</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Header must be inside BrowserRouter so NavLink works */}
          <Header />
          <AppRoutes />
          {/* Footer placed here so it's visible on every page */}
          
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

// src/App.tsx
// import React from "react";
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
//  import {  useAuth } from "@/contexts/AuthContext";
// import { ProtectedRoute } from "@/components/ProtectedRoute";
// import Header from "@/components/Header";

// // Pages
// import Index from "@/pages/Index";
// import Login from "@/pages/auth/Login";
// import Register from "@/pages/auth/Register";
// import TimetableGenerator from "@/pages/TimetableGenerator";
// import NotFound from "@/pages/NotFound";

// // Role pages
// import StudentDashboard from "@/pages/Student/Dashboard";
// import FacultyDashboard from "@/pages/Faculty/Dashboard";
// import FacultyMyTimeTable from "@/pages/Faculty/MyTimetable";
// import FacultyAvailability from "@/pages/Faculty/Availability";
// import AdminDashboard from "@/pages/Admin/Dashboard";
// import AdminClasses from "@/pages/Admin/classes";
// import AdminPrograms from "@/pages/Admin/Programs";
// import AdminRooms from "@/pages/Admin/Rooms";
// import AdminCourses from "@/pages/Admin/Courses";


// // Redirect authenticated users away from login/register
// const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // Use the actual fields your AuthContext provides:
//   const { user, loading } = useAuth();

//   if (loading) return null;
//   if (user) return <Navigate to="/dashboard" replace />;

//   return <>{children}</>;
// };

// // DashboardRedirect
// const DashboardRedirect: React.FC = () => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     if (loading) return;
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     const role = (user.role || "").toLowerCase();
//     if (role === "admin") navigate("/admin/dashboard");
//     else if (role === "faculty") navigate("/faculty/dashboard");
//     else navigate("/student/dashboard");
//   }, [user, loading, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <div className="text-white text-xl">Redirecting to your dashboard...</div>
//     </div>
//   );
// };

// // TimetableRedirect (same pattern)
// const TimetableRedirect: React.FC = () => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     if (loading) return;
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     const role = (user.role || "").toLowerCase();
//     if (role === "faculty") navigate("/faculty/my-timetable");
//     else navigate("/student/my-timetable");
//   }, [user, loading, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <div className="text-white text-xl">Redirecting to your timetable...</div>
//     </div>
//   );
// };

// const AppRoutes = () => (
//   <Routes>
//     <Route path="/" element={<Index />} />
//     <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//     <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

//     <Route path="/product" element={<div>Product</div>} />
//     <Route path="/pricing" element={<div>Pricing</div>} />
//     <Route path="/documentation" element={<div>Documentation</div>} />
//     <Route path="/about" element={<div>About</div>} />

//     <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

//     {/* Student */}
//     <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["Student"]}><StudentDashboard /></ProtectedRoute>} />
//     <Route path="/student/my-timetable" element={<ProtectedRoute allowedRoles={["Student"]}><div>Student Timetable</div></ProtectedRoute>} />

//     {/* Faculty */}
//     <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={["Faculty"]}><FacultyDashboard /></ProtectedRoute>} />
//     <Route path="/faculty/my-timetable" element={<ProtectedRoute allowedRoles={["Faculty"]}><FacultyMyTimeTable /></ProtectedRoute>} />
//     <Route path="/faculty/availability" element={<ProtectedRoute allowedRoles={["Faculty"]}><FacultyAvailability /></ProtectedRoute>} />

//     {/* Admin */}
//     <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />
//     <Route path="/admin/classes" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminClasses /></ProtectedRoute>} />
//     <Route path="/admin/programs" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminPrograms /></ProtectedRoute>} />
//     <Route path="/admin/rooms" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminRooms /></ProtectedRoute>} />
//     <Route path="/admin/faculty" element={<ProtectedRoute allowedRoles={["Admin"]}><div>Admin Faculty</div></ProtectedRoute>} />
//     <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminCourses /></ProtectedRoute>} />

//     <Route path="/timetable-generator" element={<ProtectedRoute allowedRoles={["Admin"]}><TimetableGenerator /></ProtectedRoute>} />
//     <Route path="/my-timetable" element={<ProtectedRoute allowedRoles={["Faculty", "Student"]}><TimetableRedirect /></ProtectedRoute>} />

//     <Route path="/profile" element={<ProtectedRoute><div>Profile</div></ProtectedRoute>} />
//     <Route path="/settings" element={<ProtectedRoute><div>Settings</div></ProtectedRoute>} />
//     <Route path="/help" element={<ProtectedRoute><div>Help</div></ProtectedRoute>} />

//     <Route path="*" element={<NotFound />} />
//   </Routes>
// );

// const App: React.FC = () => (
//   <TooltipProvider>
//     <Toaster />
//     <Sonner />
//     <Header />
//     <AppRoutes />
//   </TooltipProvider>
// );

// export default App;
