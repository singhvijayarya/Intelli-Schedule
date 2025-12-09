// src/components/Header.tsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Home", to: "/" },
  { name: "Product", to: "/product" },
  { name: "Pricing", to: "/pricing" },
  { name: "Documentation", to: "/documentation" },
  { name: "About", to: "/about" },
];

export default function Header(): JSX.Element {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const roleLabel = user?.role ? String(user.role) : null;

  // Robust role -> dashboard mapping (case-insensitive, tolerant)
  const normalize = (s?: string) => (s || "").toString().trim().toLowerCase();

  const goToRoleDashboard = (role?: string) => {
    const r = normalize(role);

    // Admin variants
    if (r.includes("admin") || r.includes("administrator") || r.includes("management")) {
      navigate("/admin/dashboard");
      return;
    }

    // Faculty variants
    if (r.includes("faculty") || r.includes("teacher") || r.includes("prof") || r.includes("staff")) {
      navigate("/faculty/dashboard");
      return;
    }

    // Student variants (default fallback)
    if (r.includes("student") || r.includes("learner") || r.includes("scholar")) {
      navigate("/student/dashboard");
      return;
    }

    // Fallback: if role missing or unrecognized, go to generic /dashboard which will redirect appropriately
    navigate("/dashboard");
  };

  const handleRoleKeyDown = (e: React.KeyboardEvent, role?: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToRoleDashboard(role);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-amber-900 via-black to-emerald-700 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-3 text-white">
                <div className="h-9 w-9 rounded-md bg-black/20 flex items-center justify-center text-white font-bold">
                  IS
                </div>
                <span className="font-semibold text-lg">Intelli-Schedule</span>
              </NavLink>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive ? "text-emerald-200 bg-black/20" : "text-white hover:text-emerald-200 hover:bg-black/10"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* If not logged in -> show user icon linking to /login */}
              {!isAuthenticated && (
                <button
                  onClick={() => navigate("/login")}
                  className="ml-3 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 transform hover:-translate-y-0.5"
                  aria-label="Login or Register"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
              )}

              {/* If logged in -> show clickable role label + logout */}
              {isAuthenticated && user && (
                <div className="ml-3 flex items-center gap-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => goToRoleDashboard(roleLabel ?? undefined)}
                    onKeyDown={(e) => handleRoleKeyDown(e, roleLabel ?? undefined)}
                    aria-label={`Open ${roleLabel ?? "profile"} dashboard`}
                    title={`Open ${roleLabel ?? "profile"} dashboard`}
                    className="px-3 py-1 rounded-md text-sm font-medium cursor-pointer select-none"
                    style={{
                      background: "rgba(0,0,0,0.12)",
                      color: "white",
                    }}
                  >
                    {roleLabel ? roleLabel : "User"}
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5"
                    aria-label="Logout"
                  >
                    Logout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setOpen((s) => !s)}
                aria-label="Open menu"
                className="p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-black/20 bg-black/20 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-all duration-150 ${
                      isActive ? "text-emerald-200 bg-black/20" : "text-white hover:text-emerald-200 hover:bg-black/10"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {!isAuthenticated && (
                <>
                  <NavLink to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white bg-black/20">
                    Login
                  </NavLink>
                  <NavLink to="/register" onClick={() => setOpen(false)} className="block mt-2 px-3 py-2 rounded-md text-base font-medium text-white bg-emerald-600">
                    Register
                  </NavLink>
                </>
              )}

              {isAuthenticated && user && (
                <div className="px-3 py-2">
                  <label className="text-xs text-muted-foreground">Role</label>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => { goToRoleDashboard(roleLabel ?? undefined); setOpen(false); }}
                    onKeyDown={(e) => { handleRoleKeyDown(e, roleLabel ?? undefined); setOpen(false); }}
                    className="w-full mt-1 px-3 py-2 rounded-md bg-black/10 text-white text-sm cursor-pointer"
                    aria-label={`Open ${roleLabel ?? "profile"} dashboard`}
                  >
                    {roleLabel ?? "User"}
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      navigate("/");
                    }}
                    className="w-full mt-3 inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
