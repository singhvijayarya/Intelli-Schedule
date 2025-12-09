// src/pages/auth/Register.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { saveAccessToken } from "@/utils/token";
import { saveSession } from "@/utils/session";
import { normalizeRole } from "@/utils/roles";

const Register: React.FC = () => {
  const navigate = useNavigate();
  // const { register } = useAuth();

  const [role, setRole] = useState<string>("Student");
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
  //     toast({ title: "Validation", description: "Please fill all fields", variant: "destructive" });
  //     return;
  //   }
  //   if (password !== confirm) {
  //     toast({ title: "Validation", description: "Passwords do not match", variant: "destructive" });
  //     return;
  //   }
  //   if (password.length < 6) {
  //     toast({ title: "Validation", description: "Password must be at least 6 characters", variant: "destructive" });
  //     return;
  //   }

  //   setLoading(true);
  //   const res = await register(email.trim(), password, name.trim(), role);
  //   setLoading(false);

  //   if (res.success) {
  //     toast({ title: "Account created", description: "You can now sign in." });
  //     navigate("/login");
  //   } else {
  //     toast({ title: "Registration failed", description: res.error || "Could not create account", variant: "destructive" });
  //   }
  // };
  
   const handleRegisterDirect = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const payload = { username, email: email.trim(), password, role: role.toLowerCase() };
    const res = await api.post("/user/register", payload);

    if (!res || !res.data) {
      toast({ title: "Error", description: "Empty response", variant: "destructive" });
      return;
    }

    // defensive extraction (same helper logic as AuthContext.extractUserAndToken)
    const maybe = res.data;
    const data = maybe?.data ?? maybe;
    const createdUser = data?.user ?? data;
    // const accessToken = data?.accessToken ?? maybe?.accessToken ?? null;
    if(createdUser){
      console.log("Registered user:", createdUser);
      toast({ title: "Account created", description: "You can now sign in." });
      navigate("/login");
    }
    else {
      toast({ title: "Error", description: (res.data?.message ?? "Register failed"), variant: "destructive" });
      return;
    }

    // // store access token if backend returned it in body
    // if (accessToken) saveAccessToken(accessToken);

    // // Finalize: fetch current-user (server cookie flow) to get canonical user
    // const cur = await api.post("/user/current-user");
    // const serverUser = cur?.data?.data ?? createdUser;

    // persist user
    // saveSession(serverUser);
    // toast({ title: "Registered", description: `Welcome ${serverUser.username}` });

    // const serverRole = normalizeRole(serverUser.role);
    // if (serverRole === "admin") navigate("/dashboard");
    // else if (serverRole === "faculty") navigate("/faculty/dashboard");
    // else navigate("/student/dashboard");
  } catch (err: any) {
    toast({ title: "Register error", description: err?.response?.data?.message ?? err.message ?? "Failed" , variant:"destructive" });
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071122] via-[#0d1116] to-[#071021] flex items-center justify-center p-4">
      <div
        className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-transparent relative bg-transparent"
        style={{
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Left warm gradient panel */}
          <div
            className="md:w-5/12 p-6 md:p-10 bg-gradient-to-br from-[#b45b1f] via-[#6f2b0b] to-[#0b1116] text-white"
            style={{ minHeight: 0, overflowY: "auto" }}
          >
            <p className="text-xs tracking-widest mb-4 opacity-80">WELCOME</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">Create your Intelli-Schedule ID.</h2>
            <p className="text-sm opacity-80 max-w-md">
              One account gives you role-based access to admin, faculty, and student features with NEP 2020-ready workflows.
            </p>

            <div className="mt-auto pt-6 text-xs opacity-80">
              <p className="mb-1 font-medium">Why register?</p>
              <p className="max-w-xs">Save preferences, personalised timetables and access future releases instantly.</p>
            </div>
          </div>

          {/* Right dark form */}
          <div
            className="md:w-7/12 bg-[#060612] p-6 md:p-10 text-white flex flex-col"
            style={{ minHeight: 0, overflow: "hidden" }}
          >
            <div style={{ overflowY: "auto", paddingRight: 6 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ffb86b] to-[#ff6a3a] flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#071021]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Register</h3>
                    <p className="text-sm text-muted-foreground mt-1">Fill the details to get started.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRegisterDirect} className="space-y-4 pb-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">REGISTER AS</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-700 py-2 px-2 rounded-md outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-2">FULL NAME</label>
                  <input
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-transparent border-b border-gray-700 py-2 px-2 outline-none"
                  />
                </div>

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
                      placeholder="Create a password"
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
                  <label className="block text-xs text-muted-foreground mb-2">CONFIRM PASSWORD</label>
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-transparent border-b border-gray-700 py-2 px-2 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-2 rounded-full bg-gradient-to-r from-[#ff7a2a] to-[#ffb84d] text-black font-semibold shadow-sm hover:opacity-95 transition"
                >
                  {loading ? <><Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" /> Registering...</> : "Register"}
                </button>
              </form>
            </div>

            <div className="text-center mt-auto pt-3">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-[#ff9a5a] hover:underline">Sign in</Link>
              </p>
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

export default Register;
