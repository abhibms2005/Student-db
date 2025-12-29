import React, { useEffect, useState } from "react";
import store from "../../utils/storage";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar
} from "recharts";
import {
  FiCalendar,
  FiBook,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowRight,
  FiUpload,
  FiEye,
  FiPlay,
  FiChevronRight,
  FiBookOpen,
  FiActivity
} from "react-icons/fi";

// Removing external CSS to prevent conflicts with new premium inline styles
// import "./Dashboard.css"; 

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let st = store.read();

    // Self-healing: If data seems corrupted or empty, reset to seed
    if (!st.subjects || st.subjects.length === 0 || !st.students || st.students.length === 0) {
      console.warn("Data missing, resetting to seed...");
      store.resetToSeed();
      window.location.reload(); // Force reload to ensure fresh data is picked up
      return;
    }

    // Select first student as default and ensure role is set
    let user = st.students.length ? st.students[0] : st.users.find(u => u.role === "student");
    if (!user) return;

    // Safety check: ensure role is defined for generation logic
    if (!user.role) user.role = "student";

    // Generate dashboard for this student
    const dashboard = store.generateDashboard(st, user);

    // Persist dashboard
    st.dashboard = dashboard;
    store.write(st);

    setData(dashboard);
  }, []);

  if (!data) return (
    <div style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#6b7280", background: "#f8fafc" }}>
      <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>Loading your amazing dashboard... 🚀</div>
    </div>
  );

  const {
    user,
    upcomingClasses = [],
    dashboardSubjects = [],
    cie_marks_for_chart = [],
    attendanceTimeline = [],
    assignment = null,
    pendingQuizzes = [],
    completedCourses = 0,
    hoursSpent = "12h",
    performance = { attendance: 0 }
  } = data;

  const overallPerformance = dashboardSubjects.length ?
    Math.round(dashboardSubjects.reduce((acc, s) => acc + (s.progress || 0), 0) / dashboardSubjects.length) : 0;

  const avgScore = dashboardSubjects.length > 0 ?
    Math.round(dashboardSubjects.reduce((acc, s) => acc + s.score, 0) / dashboardSubjects.length) : 0;

  const bestSubject = dashboardSubjects.length > 0 ?
    dashboardSubjects.reduce((prev, current) => (prev.score > current.score) ? prev : current).name : 'N/A';

  // Styles
  const containerStyle = {
    padding: "32px",
    maxWidth: "1400px",
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    minHeight: "100vh"
  };

  const headerStyle = {
    marginBottom: "40px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    padding: "48px 32px",
    borderRadius: "24px",
    color: "white",
    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px"
  };

  const cardStyle = {
    background: "white",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    border: "1px solid #f1f5f9",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    position: "relative",
    overflow: "hidden"
  };

  const sectionTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div>
          <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>
            Academic Year 2024-25
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "8px", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
            Welcome back, {user?.name ?? "Student"}!!! 👋
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: "0.95", maxWidth: "600px" }}>
            You're doing great! Keep pushing forward and achieving your goals.
          </p>
        </div>
        <div style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          padding: "16px 24px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          border: "1px solid rgba(255,255,255,0.3)"
        }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", opacity: 0.8, fontWeight: "600" }}>Current Term</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>Mid-Sem</div>
          </div>
          <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.4)" }}></div>
          <div>
            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", opacity: 0.8, fontWeight: "600" }}>Roll No</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>{user?.id || 'CS101'}</div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>

        {/* Performance Card */}
        <div style={{ ...cardStyle }}>
          <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", background: "#eff6ff", borderRadius: "50%", zIndex: 0 }}></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ padding: "10px", background: "#dbeafe", borderRadius: "12px", color: "#2563eb" }}><FiTrendingUp size={24} /></div>
              <span style={{ fontWeight: "600", color: "#64748b" }}>Performance</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>{overallPerformance}%</div>
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "4px" }}>Course Completion</div>
          </div>
        </div>

        {/* Completed Courses */}
        <div style={{ ...cardStyle }}>
          <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", background: "#f0fdf4", borderRadius: "50%", zIndex: 0 }}></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ padding: "10px", background: "#dcfce7", borderRadius: "12px", color: "#16a34a" }}><FiCheckCircle size={24} /></div>
              <span style={{ fontWeight: "600", color: "#64748b" }}>Completed</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>{completedCourses}</div>
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "4px" }}>Courses Done</div>
          </div>
        </div>

        {/* Attendance (Clickable) */}
        <Link to="/student/attendance" style={{ textDecoration: "none" }}>
          <div style={{ ...cardStyle, border: "2px solid #fdba74", background: "#fff7ed", cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", background: "#ffedd5", borderRadius: "50%", zIndex: 0 }}></div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ padding: "10px", background: "#ffedd5", borderRadius: "12px", color: "#ea580c" }}><FiCalendar size={24} /></div>
                <span style={{ fontWeight: "600", color: "#9a3412" }}>Attendance</span>
              </div>
              <div style={{ fontSize: "0.9rem", color: "#c2410c", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
                View Details <FiArrowRight />
              </div>
            </div>
          </div>
        </Link>

        {/* Active Subjects */}
        <div style={{ ...cardStyle }}>
          <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", background: "#f3e8ff", borderRadius: "50%", zIndex: 0 }}></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ padding: "10px", background: "#f3e8ff", borderRadius: "12px", color: "#9333ea" }}><FiBook size={24} /></div>
              <span style={{ fontWeight: "600", color: "#64748b" }}>Subjects</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>{dashboardSubjects.length}</div>
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "4px" }}>Active Classes</div>
          </div>
        </div>

      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>

        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Courses and Progress */}
          <div style={{ ...cardStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={sectionTitleStyle}><FiBookOpen color="#3b82f6" /> Course Progress</h2>
              <button style={{ background: "none", border: "none", color: "#3b82f6", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>View All</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {dashboardSubjects.map((sub, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "20px", padding: "16px", background: "#f8fafc", borderRadius: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "white", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#64748b", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                    0{idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0, fontWeight: "700", color: "#334155" }}>{sub.name}</h4>
                      <span style={{ fontWeight: "600", color: sub.score >= 80 ? "#16a34a" : "#ca8a04" }}>{sub.score}% Score</span>
                    </div>
                    <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{
                        width: `${sub.progress}%`,
                        height: "100%",
                        background: sub.progress >= 80 ? "linear-gradient(90deg, #22c55e, #16a34a)" : "linear-gradient(90deg, #fbbf24, #d97706)",
                        borderRadius: "4px"
                      }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            <div style={{ ...cardStyle }}>
              <h2 style={sectionTitleStyle}><FiActivity color="#8b5cf6" /> CIE Performance</h2>
              <div style={{ height: "250px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cie_marks_for_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="cie" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="obtained" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                    <Line type="monotone" dataKey="expected" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ ...cardStyle }}>
              <h2 style={sectionTitleStyle}><FiCalendar color="#f43f5e" /> Attendance Trend</h2>
              <div style={{ height: "250px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="val" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Upcoming Classes */}
          <div style={{ ...cardStyle }}>
            <h2 style={sectionTitleStyle}>📅 Upcoming Classes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {upcomingClasses.map((cls, idx) => (
                <div key={idx} style={{ padding: "16px", background: "#f8fafc", borderRadius: "16px", borderLeft: "4px solid #3b82f6" }}>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <FiClock /> {cls.time} • {cls.timeLeft} left
                  </div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "1rem", color: "#1e293b" }}>{cls.title}</h4>
                  <div style={{ fontSize: "0.9rem", color: "#3b82f6", fontWeight: "600" }}>{cls.subject}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments - High Priority */}
          <div style={{ ...cardStyle, background: "#fef2f2", border: "1px solid #fee2e2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ ...sectionTitleStyle, margin: 0, color: "#991b1b" }}>⚠️ Assignment</h2>
              <span style={{ background: "#fca5a5", color: "#7f1d1d", fontSize: "0.75rem", padding: "4px 8px", borderRadius: "6px", fontWeight: "700" }}>HIGH PRIORITY</span>
            </div>
            {assignment ? (
              <div>
                <h3 style={{ margin: "0 0 8px 0", color: "#7f1d1d" }}>{assignment.title}</h3>
                <p style={{ margin: 0, color: "#b91c1c", fontSize: "0.9rem", marginBottom: "16px" }}>{assignment.subject} • Due {assignment.deadline}</p>
                <button style={{ width: "100%", padding: "12px", background: "#ef4444", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer" }}>
                  Submit Now
                </button>
              </div>
            ) : (
              <p>No pending assignments.</p>
            )}
          </div>

          {/* Assessment / Quizzes */}
          <div style={{ ...cardStyle }}>
            <h2 style={sectionTitleStyle}>❓ Pending Quizzes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pendingQuizzes.map((q, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                  <div>
                    <div style={{ fontWeight: "600", color: "#334155" }}>{q.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{q.questions} Questions</div>
                  </div>
                  <button style={{ padding: "8px 16px", background: "#3b82f6", color: "white", borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer" }}>Start</button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}