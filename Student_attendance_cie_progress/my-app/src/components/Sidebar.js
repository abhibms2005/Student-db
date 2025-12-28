import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/auth";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar card">
      <nav>
        {user?.role === "student" && (
          <>
            <Link className="nav-link" to="/student/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/student/progress">Progress</Link>
            <Link className="nav-link" to="/student/attendance">Attendance</Link>
            <Link className="nav-link" to="/student/reports">Reports</Link>
            <Link className="nav-link" to="/student/activity">Activity Cretificates</Link>
          </>
        )}

        {user?.role === "faculty" && (
          <>
    <Link className="nav-link" to="/faculty/dashboard">Faculty Dashboard</Link>
    <Link className="nav-link" to="/faculty/progress">Manage Marks</Link>
    <Link className="nav-link" to="/faculty/reports">Reports & Messaging</Link>
    <Link className="nav-link" to="/faculty/viewcertificate">View Certificate</Link>
   </>
    )}
        {user?.role === "proctor" && (
        <>
          <Link className="nav-link" to="/proctor/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/proctor/certificates">Cretificates</Link>
          <Link className="nav-link" to="/proctor/activitycertificate">Activity Cretificates</Link>
          <Link className="nav-link" to="/proctor/attendence">Attendence</Link>
        </>
      )}
      </nav>
    </aside>
  );
}
