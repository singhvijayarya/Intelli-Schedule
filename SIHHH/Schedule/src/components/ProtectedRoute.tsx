// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { UserRole } from '@/types';
// import { Loader2 } from 'lucide-react';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles?: UserRole[];
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
//   const { isAuthenticated, loading, user } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (allowedRoles && user && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <>{children}</>;
// };


// ========
// Vansh
// ===========

// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Loader2 } from "lucide-react";
import { normalizeRole } from "@/utils/roles"; // <- add this helper

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in -> send to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize user's role to a comparable value (returns null if unknown)
  const userRoleNormalized = normalizeRole(user?.role ?? null); // returns "admin"|"faculty"|"student"|null

  // If no specific allowedRoles were provided, allow any authenticated user
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Build a normalized allowed-roles set for comparison
  const normalizedAllowed = allowedRoles
    .map((r) => normalizeRole(String(r))) // convert enum/values to normalized string
    .filter(Boolean) as string[]; // keep only non-null

  // If user has no recognizable role or isn't in allowed set, deny access
  if (!userRoleNormalized || !normalizedAllowed.includes(userRoleNormalized)) {
    // Redirect to an "unauthorized" page or login — avoid ping-ponging to /dashboard
    return <Navigate to="/unauthorized" replace />; // you can change to "/login" if you prefer
  }

  return <>{children}</>;
};
