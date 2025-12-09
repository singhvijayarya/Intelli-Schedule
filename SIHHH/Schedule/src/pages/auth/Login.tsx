// src/pages/auth/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {normalizeRole} from "@/utils/roles";

const Login: React.FC = () => {
  const { validateCredentials, finalizeLogin} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [chosenRole, setChosenRole] = useState<string>("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // const handleSignIn = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!email.trim() || !password) {
  //     toast({ title: "Validation", description: "Please enter email and password", variant: "destructive" });
  //     return;
  //   }

  //   setLoading(true);
    
  //   try {
  //     // Step 1: Validate credentials first
  //     const validationResult = await validateCredentials(email.trim(), password);
      
  //     if (!validationResult.success) {
  //       toast({ 
  //         title: "Login Failed", 
  //         description: validationResult.error || "Invalid credentials", 
  //         variant: "destructive" 
  //       });
  //       return;
  //     }

  //     // Step 2: Check if the selected role matches the registered role
  //     const registeredRole = validationResult.user?.role;
      
  //     if (chosenRole !== registeredRole) {
  //       toast({ 
  //         title: "Role Mismatch", 
  //         description: `This account is registered as '${registeredRole}'. Please select '${registeredRole}' to login.`,
  //         variant: "destructive" 
  //       });
  //       return;
  //     }

  //     // Step 3: Only proceed with login if roles match
  //     const finalResult = await finalizeLogin();
      
  //     if (!finalResult.success) {
  //       toast({ 
  //         title: "Login Failed", 
  //         description: finalResult.error || "Could not complete login", 
  //         variant: "destructive" 
  //       });
  //       return;
  //     }

  //     toast({ 
  //       title: "Welcome", 
  //       description: `Logged in as ${finalResult.user?.role}` 
  //     });
  //      const role = normalizeRole(finalResult.user?.role);
  //     // ✅ FIXED: Redirect based on role
  //     if (role === "admin") {
  //       navigate("/dashboard");
  //     } else if (role === "faculty") {
  //       navigate("/faculty/dashboard"); // Adjust this path as needed
  //     } else {
  //       // For Students, redirect to Student Dashboard
  //       navigate("/student/dashboard");
  //     }
      
  //   } catch (error) {
  //     toast({ 
  //       title: "Login Error", 
  //       description: "An unexpected error occurred", 
  //       variant: "destructive" 
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email.trim() || !password) {
    toast({ title: "Validation", description: "Enter email and password", variant: "destructive" });
    return;
  }

  setLoading(true);
  try {
    // 1) pre-check credentials (this also may create cookies / return user)
    const validationResult = await validateCredentials(email.trim(), password);
    console.debug("[Login] validate result:", validationResult);

    if (!validationResult.success) {
      toast({ title: "Login Failed", description: validationResult.error || "Invalid credentials", variant: "destructive" });
      return;
    }

    // 2) check chosen role vs registered role (normalized)
    const registeredRoleRaw = validationResult.user?.role ?? (validationResult as any).role;
    const registeredRole = normalizeRole(registeredRoleRaw);
    const chosen = normalizeRole(chosenRole);

    console.debug("[Login] chosen role:", chosen, "registered role:", registeredRole);
    if (!registeredRole) {
      toast({ title: "Login Failed", description: "Account has no role assigned", variant: "destructive" });
      return;
    }
    if (chosen !== registeredRole) {
      toast({
        title: "Role Mismatch",
        description: `This account is registered as '${registeredRole}'. Please select '${registeredRole}' to login.`,
        variant: "destructive",
      });
      return;
    }

    // 3) finalize login (server authoritative) and persist user
    const finalResult = await finalizeLogin();
    console.debug("[Login] finalize result:", finalResult);

    if (!finalResult.success || !finalResult.user) {
      toast({ title: "Login Failed", description: finalResult.error || "Could not complete login", variant: "destructive" });
      return;
    }

    // 4) Normalize server role and redirect
    const serverRole = normalizeRole(finalResult.user.role);
    console.info("[Login] serverRole:", serverRole, "navigating...");
    console.log("[Login] before navigate, location:", window.location.href);
navigate("/dashboard");



    if (serverRole === "admin") {
      navigate("/dashboard");
      console.log("[Login] after navigate, location:", window.location.href);
      return;
    } else if (serverRole === "faculty") {
      navigate("/faculty/dashboard");
      console.log("[Login] after navigate, location:", window.location.href);
      return;
    } else {
      navigate("/student/dashboard");
      console.log("[Login] after navigate, location:", window.location.href);
      return;
    }
  } catch (err) {
    console.error("[Login] unexpected error:", err);
    toast({ title: "Login Error", description: "An unexpected error occurred", variant: "destructive" });
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071122] via-[#0d1116] to-[#071021] flex items-center justify-center p-4">
      <div
        className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-transparent relative"
        style={{ maxHeight: "calc(100vh - 48px)", display: "flex", flexDirection: "column" }}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Left warm gradient panel */}
          <div className="md:w-5/12 p-6 md:p-10 bg-gradient-to-br from-[#b45b1f] via-[#6f2b0b] to-[#0b1116] text-white" style={{ minHeight: 0, overflowY: "auto" }}>
            <p className="text-xs tracking-widest mb-4 opacity-80">WELCOME TO INTELLI-SCHEDULE</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">We're delighted to have you here.</h2>
            <p className="text-sm opacity-80 max-w-md">
              AI-powered timetable automation aligned with NEP 2020. Secure role-based dashboards and fast data imports.
            </p>

            <div className="mt-auto pt-6 text-xs opacity-80">
              <p className="mb-1 font-medium">💡 Tip</p>
              <p className="max-w-xs">Select the correct role that matches your account registration.</p>
            </div>
          </div>

          {/* Right dark form */}
          <div className="md:w-7/12 bg-[#060612] p-6 md:p-10 text-white flex flex-col" style={{ minHeight: 0 }}>
            <div style={{ overflowY: "auto", paddingRight: 6 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ffb86b] to-[#ff6a3a] flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#071021]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Sign in</h3>
                    <p className="text-sm text-muted-foreground mt-1">Access your role-based dashboard</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4 pb-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">EMAIL</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    className="w-full bg-transparent border-b border-gray-700 py-2 px-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-2">PASSWORD</label>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-transparent border-b border-gray-700 py-2 px-2 pr-10 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-sm text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-2">LOGIN AS</label>
                  <select
                    value={chosenRole}
                    onChange={(e) => setChosenRole(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-700 py-2 px-2 rounded-md outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div />
                  <Link to="/register" className="text-sm text-[#ff9a5a] hover:underline">Create account</Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-2 rounded-full bg-gradient-to-r from-[#ff7a2a] to-[#ffb84d] text-black font-semibold shadow-sm hover:opacity-95 transition"
                >
                  {loading ? <><Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" /> Signing in...</> : "Sign in"}
                </button>
              </form>
            </div>

            <div className="text-center mt-auto pt-3">
              <p className="text-sm text-muted-foreground">Smart Innovation Hackathon 2025 • SIH25091</p>
            </div>
          </div>
        </div>

        {/* Neon border overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl"
             style={{
               boxShadow: "inset 0 0 0 1px rgba(255,80,50,0.08), 0 0 40px rgba(255,80,50,0.06)",
               borderRadius: 24,
               border: "1px solid rgba(255,80,50,0.12)"
             }} />
      </div>
    </div>
  );
};

export default Login;