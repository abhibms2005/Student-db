import React from "react";
import { useAuth } from "../utils/auth";
import { Sun, Moon } from "lucide-react"; // 🌞 & 🌙 icons

export default function Navbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = React.useState(() => localStorage.getItem("spams_theme") || "light");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    localStorage.setItem("spams_theme", theme);
  }, [theme]);

  // Toggle between light & dark
  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  return (
    <div className="navbar">
      <div className="brand">
        <div className="logo">SP</div>
        <div>
          <div className="app-title">Student Performance & Attendance</div>
          <div className="small muted">Combined academic dashboard</div>
        </div>
      </div>

      <div className="user-actions">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* 🌗 Theme toggle icon */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost icon-btn"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {user ? (
          <>
            <div className="small muted">
              {user.name} • {user.role}
            </div>
            <button className="btn btn-primary" onClick={logout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
