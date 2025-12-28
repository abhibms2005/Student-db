import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiHome, FiLayers, FiFileText, FiClipboard } from "react-icons/fi";
import "./layout.css";

export default function FacultyLayout() {

  return (
    <div className="layout">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Faculty</h2>

        <nav className="sidebar-nav">
          <NavLink to="/faculty/dashboard" className="nav-item">
            <FiHome /> Dashboard
          </NavLink>

          <NavLink to="/faculty/progress" className="nav-item">
            <FiLayers /> Progress
          </NavLink>

          <NavLink to="/faculty/reports" className="nav-item">
            <FiFileText /> Reports
          </NavLink>

          <NavLink to="/faculty/certificates" className="nav-item">
            <FiClipboard /> Certificates
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">Logout</button>
        </div>
      </aside>

      {/* Page content */}
      <main className="content">
        <Outlet/>
      </main>
    </div>
  );
}
