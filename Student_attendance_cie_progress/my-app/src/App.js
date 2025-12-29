import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./utils/auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Student Pages
import StudentDashboard from "./pages/Student/Dashboard";
import Progress from "./pages/Student/Progress";
import Attendance from "./pages/Student/Attendance";
import Reports from "./pages/Student/Reports";
import StudentActivityCertificates from "./pages/Student/StudentActivityCertificates";

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyProgress from "./pages/faculty/FacultyProgress";
import FacultyReports from "./pages/faculty/FacultyReports";
import ViewCertificates from "./pages/faculty/ViewCertificates";

// Proctor Pages
import ProctorDashboard from "./pages/proctor/ProctorDashboard";
import Certificates from "./pages/proctor/Certificates";
import ActivityCertificates from "./pages/proctor/ActivityCertificates";
import ProctorAttendance from "./pages/proctor/Attendance";

// Auth & Registration
import Login from "./pages/Login";
import FacultyRegister from "./Register/FacultyRegister";
import StudentRegister from "./Register/StudentRegister";
import RegisterRoleSelect from "./Register/RegisterRoleSelect";

// App layout wrapper
function AppLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <div className="main">
        <Sidebar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

// Role-protected route
function RoleRoute({ children, allowed }) {
  const { user } = useAuth();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user's role is not in the allowed list, redirect to their correct dashboard
  if (!allowed.includes(user.role)) {
    // Redirect to user's actual role dashboard
    if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user.role === "faculty") {
      return <Navigate to="/faculty/dashboard" replace />;
    } else if (user.role === "proctor") {
      return <Navigate to="/proctor/dashboard" replace />;
    }
    // Fallback to login
    return <Navigate to="/login" replace />;
  }

  // User has correct role, render the protected content
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page: registration role select */}
          <Route path="/" element={<RegisterRoleSelect />} />

          {/* Registration */}
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/faculty" element={<FacultyRegister />} />

          {/* Login (optional, only via link) */}
          <Route path="/login" element={<Login />} />

          {/* STUDENT routes */}
          <Route
            path="/student/*"
            element={
              <RoleRoute allowed={["student"]}>
                <AppLayout>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="activity" element={<StudentActivityCertificates />} />
                    <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
                  </Routes>
                </AppLayout>
              </RoleRoute>
            }
          />

          {/* FACULTY routes */}
          <Route
            path="/faculty/*"
            element={
              <RoleRoute allowed={["faculty"]}>
                <AppLayout>
                  <Routes>
                    <Route path="dashboard" element={<FacultyDashboard />} />
                    <Route path="progress" element={<FacultyProgress />} />
                    <Route path="reports" element={<FacultyReports />} />
                    <Route path="viewcertificate" element={<ViewCertificates />} />
                    <Route path="*" element={<Navigate to="/faculty/dashboard" replace />} />
                  </Routes>
                </AppLayout>
              </RoleRoute>
            }
          />

          {/* PROCTOR routes */}
          <Route
            path="/proctor/*"
            element={
              <RoleRoute allowed={["proctor"]}>
                <AppLayout>
                  <Routes>
                    <Route path="dashboard" element={<ProctorDashboard />} />
                    <Route path="certificates" element={<Certificates />} />
                    <Route path="activitycertificate" element={<ActivityCertificates />} />
                    <Route path="attendance" element={<ProctorAttendance />} />
                    <Route path="*" element={<Navigate to="/proctor/dashboard" replace />} />
                  </Routes>
                </AppLayout>
              </RoleRoute>
            }
          />

          {/* Catch-all fallback: redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
