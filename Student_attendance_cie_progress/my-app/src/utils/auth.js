import React, { createContext, useContext, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

// Demo users (match `storage.js` seed where possible)
const dummyUsers = [
  { id: "s1", role: "student", name: "Alice", email: "alice@example.com", password: "pass" },
  { id: "f1", role: "faculty", name: "Prof. Bob", email: "bob@example.com", password: "pass" },
  { id: "p1", role: "proctor", name: "Proctor John", email: "proctor@example.com", password: "pass" },
];

export function AuthProvider({ children }) {
  // initialize from sessionStorage if available; otherwise null
  const getStoredUser = () => {
    try {
      const raw = sessionStorage.getItem("spams_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);

  // login: prefer calling local API (storage.js). Fallback to frontend dummy users.
  async function login(email, password, role = null) {
    try {
      const res = await api.login(email, password, role);
      // persist user in session so other parts can read
      try { sessionStorage.setItem("spams_user", JSON.stringify(res.user)); } catch (e) { }
      setUser(res.user);
      return { ok: true, user: res.user };
    } catch (err) {
      // fallback to dummy users (with role validation)
      const found = dummyUsers.find((u) => u.email === email && u.password === password);
      if (found) {
        // Validate role if provided
        if (role && found.role !== role) {
          return { ok: false, error: `Invalid role. This account is registered as ${found.role}, not ${role}.` };
        }
        const { password: _p, ...userSafe } = found;
        try { sessionStorage.setItem("spams_user", JSON.stringify(userSafe)); } catch (e) { }
        setUser(userSafe);
        return { ok: true, user: userSafe };
      }
      return { ok: false, error: err.message || "Invalid credentials" };
    }
  }

  function logout() {
    try { sessionStorage.removeItem("spams_user"); } catch (e) { }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, dummyUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default dummyUsers;
