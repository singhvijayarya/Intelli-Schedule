// // src/contexts/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState } from "react";

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   password?: string;
// };

// type AuthResult = {
//   success: boolean;
//   error?: string;
//   user?: Omit<User, "password">;
// };

// type AuthContextType = {
//   user: Omit<User, "password"> | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   register: (email: string, password: string, name?: string, role?: string) => Promise<AuthResult>;
//   validateCredentials: (email: string, password: string) => Promise<AuthResult>;
//   finalizeLogin: (email: string, chosenRole: string) => Promise<AuthResult>;
//   logout: () => void;
//   updateRole: (newRole: string) => void;
//   debugListUsers: () => User[];
// };

// const LOCAL_USER_KEY = "timetable_weaver_user";
// const LOCAL_USERS_LIST_KEY = "timetable_weaver_users";
// const LEGACY_USERS_KEY = "timetable_users";

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<Omit<User, "password"> | null>(null);
//   const [usersList, setUsersList] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const normalize = (s: string) => s.trim().toLowerCase();

//   const loadUsers = (): User[] => {
//     try {
//       // migrate legacy key if present
//       const legacy = localStorage.getItem(LEGACY_USERS_KEY);
//       if (legacy && !localStorage.getItem(LOCAL_USERS_LIST_KEY)) {
//         localStorage.setItem(LOCAL_USERS_LIST_KEY, legacy);
//         localStorage.removeItem(LEGACY_USERS_KEY);
//       }
//       const raw = localStorage.getItem(LOCAL_USERS_LIST_KEY);
//       if (!raw) return [];
//       const parsed = JSON.parse(raw);
//       if (!Array.isArray(parsed)) return [];
//       return parsed as User[];
//     } catch (e) {
//       console.warn("Auth loadUsers error", e);
//       return [];
//     }
//   };

//   useEffect(() => {
//     try {
//       const rawUser = localStorage.getItem(LOCAL_USER_KEY);
//       if (rawUser) setUser(JSON.parse(rawUser));
//     } catch {}
//     const u = loadUsers();
//     setUsersList(u);
//     setIsLoading(false);
//   }, []);

//   const persistUsers = (list: User[]) => {
//     setUsersList(list);
//     try {
//       localStorage.setItem(LOCAL_USERS_LIST_KEY, JSON.stringify(list));
//     } catch (e) {
//       console.warn("Auth persistUsers error", e);
//     }
//   };

//   const persistCurrent = (u: Omit<User, "password"> | null) => {
//     setUser(u);
//     try {
//       if (u) localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
//       else localStorage.removeItem(LOCAL_USER_KEY);
//     } catch (e) {
//       console.warn("Auth persistCurrent error", e);
//     }
//   };

//   const debugListUsers = () => usersList;

//   const register = async (email: string, password: string, name?: string, role?: string): Promise<AuthResult> => {
//     setIsLoading(true);
//     try {
//       await new Promise((r) => setTimeout(r, 250));
//       if (!email || !password || !name) return { success: false, error: "Name, email and password required" };
//       if (password.length < 6) return { success: false, error: "Password must be >= 6 characters" };
//       const normalized = normalize(email);
//       if (usersList.some((u) => normalize(u.email) === normalized)) return { success: false, error: "Account exists" };

//       const newUser: User = {
//         id: String(Date.now()),
//         name: name.trim(),
//         email: normalized,
//         role: role || "Student",
//         password, // demo-only
//       };
//       const updated = [...usersList, newUser];
//       persistUsers(updated);
//       return { success: true };
//     } catch (err: any) {
//       return { success: false, error: err?.message || "Registration failed" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const validateCredentials = async (email: string, password: string): Promise<AuthResult> => {
//     setIsLoading(true);
//     try {
//       await new Promise((r) => setTimeout(r, 200));
//       if (!email || !password) return { success: false, error: "Email and password required" };
//       const normalized = normalize(email);
//       const found = usersList.find((u) => normalize(u.email) === normalized);
//       if (!found) return { success: false, error: "No account found for this email" };
//       if (found.password !== password) return { success: false, error: "Incorrect password" };
//       // return stored role but DO NOT persist login
//       const { password: _, ...safe } = found as any;
//       return { success: true, user: safe };
//     } catch (err: any) {
//       return { success: false, error: err?.message || "Validation failed" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const finalizeLogin = async (email: string, chosenRole: string): Promise<AuthResult> => {
//     setIsLoading(true);
//     try {
//       await new Promise((r) => setTimeout(r, 200));
//       const normalized = normalize(email);
//       const found = usersList.find((u) => normalize(u.email) === normalized);
//       if (!found) return { success: false, error: "Account not found" };
//       if (found.role !== chosenRole) {
//         return { success: false, error: `This account is registered as '${found.role}', not '${chosenRole}'.` };
//       }
//       const { password: _, ...safe } = found as any;
//       persistCurrent(safe);
//       // ensure stored list uses normalized email & same role
//       persistUsers(usersList.map((u) => (normalize(u.email) === normalized ? { ...u, email: normalized, role: chosenRole } : u)));
//       return { success: true, user: safe };
//     } catch (err: any) {
//       return { success: false, error: err?.message || "Login finalize failed" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => persistCurrent(null);

//   const updateRole = (newRole: string) => {
//     if (!user) return;
//     const normalized = normalize(user.email);
//     const updated = usersList.map((u) => (normalize(u.email) === normalized ? { ...u, role: newRole } : u));
//     persistUsers(updated);
//     persistCurrent({ ...user, role: newRole });
//   };

//   const ctx: AuthContextType = {
//     user,
//     isAuthenticated: Boolean(user),
//     isLoading,
//     register,
//     validateCredentials,
//     finalizeLogin,
//     logout,
//     updateRole,
//     debugListUsers,
//   };

//   return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
// };

// export const useAuth = (): AuthContextType => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };




// =====================

// Change By Vansh 
// =====================




// src/contexts/AuthContext.tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api"; // <-- confirm this path exists; replace with "../lib/api" if needed
import { saveSession, getSession, clearSession } from "@/utils/session";
import { normalizeRole } from "@/utils/roles";
import { saveAccessToken,  getAccessToken} from "@/utils/token";

/**
 * Defensive AuthContext that:
 * - logs helpful diagnostics
 * - tolerates different response shapes
 * - persists user via saveSession/getSession helpers
 */

type User = {
  _id?: string;
  username?: string;
  email?: string;
  role?: string;
  avatar?: any;
  // ...other server fields
};



type ResultBase = {
  success: boolean;
  error?: string;
  user?: User | null;
  accessToken?: string | null;
};
type ValidateResult = {
  success: boolean;
  user?: User | null;
  error?: string;
};

type FinalizeResult = {
  success: boolean;
  user?: User | null;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  validateCredentials: (email: string, password: string) => Promise<ValidateResult>;
  register: (payload: { username?: string; email: string; password: string; role?: string }, autoLogin?: boolean) => Promise<ResultBase>;
  finalizeLogin: () => Promise<FinalizeResult>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshCurrentUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return getSession();
    } catch (e) {
      console.warn("getSession failed during init", e);
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(false);

  // On start: attempt to refresh user from server (safer than relying on stale localStorage)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // try to fetch current user from server; this will validate session/cookies
        const res = await api.post("/user/current-user");
        if (res && res.data && (res.data.statusCode === 200) && res.data.data) {
          const serverUser = res.data.data;
          setUser(serverUser);
          saveSession(serverUser);
          console.info("[AuthProvider] initial user fetched from server", serverUser);
        } else {
          // keep local session if exists but clear if server says no
          const local = getSession();
          if (!local) {
            setUser(null);
            clearSession();
          } else {
            // local exists but server didn't return valid session; keep local but warn
            console.warn("[AuthProvider] server did not return a current-user; using local session", res?.data);
            setUser(local);
          }
        }
      } catch (err) {
        console.warn("[AuthProvider] initial user fetch failed", err);
        // don't throw — allow app to boot; clear session to avoid inconsistent state
        setUser(null);
        clearSession();
      } finally {
        setLoading(false);
      }
    })();
    // run only once
  }, []);

   // ----- helper: extract user and token (defensive) -----
  const extractUserAndToken = (resData: any): { user?: User | null; accessToken?: string | null } => {
    if (!resData) return { user: null, accessToken: null };

    // Case 1: wrapper { statusCode, data: {...} }
    if (typeof resData === "object" && "statusCode" in resData && "data" in resData) {
      const d = resData.data;
      const user = d?.user ?? (typeof d === "object" ? d : null);
      const accessToken = d?.accessToken ?? (resData as any)?.accessToken ?? null;
      return { user, accessToken };
    }

    // Case 2: { user: {...}, accessToken: '...' }
    if (typeof resData === "object" && "user" in resData) {
      return { user: resData.user ?? null, accessToken: resData.accessToken ?? null };
    }

    // Case 3: resData itself is the user object
    if (typeof resData === "object" && (resData._id || resData.email || resData.username)) {
      return { user: resData, accessToken: null };
    }

    return { user: null, accessToken: null };
  };




    const register = async (
    payload: { username?: string; email: string; password: string; role?: string },
    autoLogin = true
  ): Promise<ResultBase> => {
    setLoading(true);
    try {
      console.debug("[auth.register] payload", { email: payload.email, username: payload.username });
      const res = await api.post("/user/register", {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        role: payload.role,
      });

      if (!res || !res.data) {
        return { success: false, error: "Empty response from register endpoint" };
      }

      // Extract user and token if backend returns tokens in body
      const { user: createdUser, accessToken } = extractUserAndToken(res.data);

      if (!createdUser) {
        // Backend might respond with wrapper { statusCode, message } on error
        const msg = res.data?.message ?? "Registration failed: unexpected server response";
        return { success: false, error: String(msg) };
      }

      // If server provided accessToken in body, save it (optional)
      if (accessToken) {
        try {
          saveAccessToken(accessToken);
        } catch (e) {
          console.warn("saveAccessToken failed", e);
        }
      }

      // Optionally finalize login: fetch /current-user so server cookies (if any) are used
      if (autoLogin) {
        // Some backends automatically create session on register; finalizeLogin will fetch server user
        const final = await finalizeLogin();
        if (!final.success) {
          // fallback: persist createdUser (best-effort) and return success
          const normalized = createdUser;
          setUser(normalized);
          saveSession(normalized);
          return { success: true, user: normalized };
        }
        return { success: true, user: final.user ?? createdUser };
      }

      // If not autoLogin, simply return created user (do not persist)
      return { success: true, user: createdUser };
    } catch (err: any) {
      console.error("[auth.register] error", err);
      const errMsg = err?.response?.data?.message ?? err?.message ?? "Registration failed";
      return { success: false, error: String(errMsg) };
    } finally {
      setLoading(false);
    }
  };
  // === validateCredentials ===
  const validateCredentials = async (email: string, password: string): Promise<ValidateResult> => {
    setLoading(true);
    try {
      const payload = { email, password };
      console.debug("[validateCredentials] calling /user/login with", { email });
      const res = await api.post("/user/login", payload);

      // Defensive reading of response shape:
      // - res.data could be { statusCode, data: { user: {...}, accessToken? } }
      // - or res.data could directly be user object
      if (!res || !res.data) {
        return { success: false, error: "Empty response from login endpoint" };
      }

      // If server uses wrapper { statusCode, data }
      const maybeWrapped = res.data;
      let userFromRes: any = null;

      if (maybeWrapped?.statusCode && maybeWrapped?.data) {
        // common shape you shared
        const d = maybeWrapped.data;
        // d might be { user: {...} } or already the user
        userFromRes = d.user ?? d;
      } else if (typeof maybeWrapped === "object") {
        // fallback: server returned user object directly
        userFromRes = maybeWrapped.user ?? maybeWrapped;
      }

      if (!userFromRes) {
        console.warn("[validateCredentials] couldn't find user in login response", res.data);
        return { success: false, error: "Unexpected login response shape" };
      }

      // Return the found user (do not persist here - this step is pre-check)
      return { success: true, user: userFromRes };
    } catch (err: any) {
      console.error("[validateCredentials] error", err);
      const errMsg = err?.response?.data?.message ?? err.message ?? "Validation failed";
      return { success: false, error: String(errMsg) };
    } finally {
      setLoading(false);
    }
  };

  // === finalizeLogin ===
  const finalizeLogin = async (): Promise<FinalizeResult> => {
    setLoading(true);
    try {
      // Fetch authoritative user from server (server should have set cookies during /login call)
      console.debug("[finalizeLogin] calling /user/current-user");
      const res = await api.post("/user/current-user");

      if (res && res.data && res.data.statusCode === 200 && res.data.data) {
        const serverUser = res.data.data;
        setUser(serverUser);
        saveSession(serverUser);
        console.info("[finalizeLogin] server user saved", serverUser);
        return { success: true, user: serverUser };
      }

      // fallback: maybe server returned user directly
      if (res && res.data && typeof res.data === "object" && res.data._id) {
        setUser(res.data);
        saveSession(res.data);
        return { success: true, user: res.data };
      }

      console.warn("[finalizeLogin] unexpected current-user response", res?.data);
      return { success: false, error: "Could not fetch current user" };
    } catch (err: any) {
      console.error("[finalizeLogin] error", err);
      const errMsg = err?.response?.data?.message ?? err.message ?? "Finalize login failed";
      return { success: false, error: String(errMsg) };
    } finally {
      setLoading(false);
    }
  };

  // === refreshCurrentUser ===
  const refreshCurrentUser = async (): Promise<User | null> => {
    try {
      const res = await api.post("/user/current-user");
      if (res?.data?.statusCode === 200 && res.data.data) {
        const u = res.data.data;
        setUser(u);
        saveSession(u);
        return u;
      }
    } catch (err) {
      console.warn("[refreshCurrentUser] error", err);
    }
    return null;
  };

  // === logout ===
  const logout = async () => {
    setLoading(true);
    try {
      // call backend logout if available (optional)
      try {
        await api.post("/user/logout");
      } catch (e) {
        // ignore network failure for logout
        console.warn("[logout] backend logout failed (ignoring)", e);
      }
      setUser(null);
      clearSession();
      console.info("[logout] cleared session");
    } finally {
      setLoading(false);
    }
  };

   return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        validateCredentials,
        isAuthenticated: !!user,
        finalizeLogin,
        refreshCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
