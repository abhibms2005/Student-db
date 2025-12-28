import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API from "../../api";
import { api as localApi } from "../../utils/api";
import store from "../../utils/storage";
import { useAuth } from "../../utils/auth";
// import "./Attendance.css"; // Removed to avoid missing file error

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE"];

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Data Fetching Logic (Preserved)
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        // Try getting from API first
        const res = await API.get("records/");
        if (!mounted) return;

        if (Array.isArray(res.data) && res.data.length > 0) {
          setRecords(res.data);
        } else {
          // Fallback to local storage (mock data)
          const local = await localApi.listAttendance(user?.id || "s1");
          if (!mounted) return;

          if (local && Array.isArray(local)) {
            const s = store.read();
            const mapped = local.map((a, idx) => {
              const subject = (s.subjects || []).find(
                (sub) => sub.id === a.subjectId
              ) || {};
              return {
                id: a.id || `local-${idx}`,
                subject: subject.name || a.subjectId, // Ensure we have the name
                date: a.date,
                status: a.status,
              };
            });
            setRecords(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
        // Final fallback
        const local = await localApi.listAttendance(user?.id || "s1");
        if (mounted && local) {
          const s = store.read();
          const mapped = local.map((a, idx) => {
            const subject = (s.subjects || []).find(
              (sub) => sub.id === a.subjectId
            ) || {};
            return {
              id: a.id || `local-${idx}`,
              subject: subject.name || a.subjectId,
              date: a.date,
              status: a.status,
            };
          });
          setRecords(mapped);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Derived Statistics
  const stats = useMemo(() => {
    if (!records.length) return { subjectStats: [], trendData: [] };

    // Group by Subject
    const subjectMap = {};
    records.forEach((r) => {
      if (!subjectMap[r.subject]) {
        subjectMap[r.subject] = { present: 0, absent: 0, total: 0 };
      }
      subjectMap[r.subject].total += 1;
      if (r.status === "present") subjectMap[r.subject].present += 1;
      else subjectMap[r.subject].absent += 1;
    });

    const subjectStats = Object.keys(subjectMap).map((sub) => ({
      name: sub,
      data: [
        { name: "Present", value: subjectMap[sub].present },
        { name: "Absent", value: subjectMap[sub].absent },
      ],
      percentage: Math.round(
        (subjectMap[sub].present / subjectMap[sub].total) * 100
      ),
    }));

    // Trend Data (Grouped by Month)
    const monthMap = {};
    records.forEach((r) => {
      const d = new Date(r.date);
      // Format: "Aug 2025"
      const monthKey = d.toLocaleString("default", { month: "short", year: "numeric" });

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          date: monthKey,
          sortDate: new Date(d.getFullYear(), d.getMonth(), 1), // for sorting
          present: 0,
          absent: 0
        };
      }

      if (r.status === "present") monthMap[monthKey].present += 1;
      else monthMap[monthKey].absent += 1;
    });

    const trendData = Object.values(monthMap).sort((a, b) => a.sortDate - b.sortDate);

    return { subjectStats, trendData };
  }, [records]);

  if (loading) return (
    <div style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#6b7280" }}>
      <div className="animate-pulse">Loading amazing data...</div>
    </div>
  );

  return (
    <div className="attendance-container" style={{ padding: "32px", maxWidth: "1280px", margin: "0 auto", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
      {/* Header Section */}
      <header style={{
        marginBottom: "40px",
        textAlign: "center",
        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        padding: "48px 20px",
        borderRadius: "24px",
        color: "white",
        boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)"
      }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "12px", letterSpacing: "-0.025em" }}>Your Attendance Journey 🚀</h1>
        <p style={{ fontSize: "1.1rem", opacity: "0.9", maxWidth: "600px", margin: "0 auto" }}>
          Track your progress, stay consistent, and achieve your goals!
        </p>
      </header>

      {records.length === 0 ? (
        <div className="empty-state" style={{ textAlign: "center", padding: "64px", background: "#f8fafc", borderRadius: "24px", border: "2px dashed #e2e8f0" }}>
          <h3 style={{ fontSize: "1.5rem", color: "#64748b", marginBottom: "8px" }}>No records yet 🍃</h3>
          <p style={{ color: "#94a3b8" }}>Expect your attendance data to bloom here soon.</p>
        </div>
      ) : (
        <>
          {/* Subject Cards Grid */}
          <section style={{ marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#334155" }}>Subject Mastery</h2>
              <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Breakdown by subject</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
              {stats.subjectStats.map((sub, idx) => {
                // Dynamic fun colors for cards
                const cardGradients = [
                  "linear-gradient(135deg, #fff 0%, #f0fdf4 100%)", // Greenish
                  "linear-gradient(135deg, #fff 0%, #eff6ff 100%)", // Blueish
                  "linear-gradient(135deg, #fff 0%, #faf5ff 100%)", // Purplish
                ];
                const bgStyle = cardGradients[idx % cardGradients.length];
                const isGood = sub.percentage >= 75;

                return (
                  <div key={sub.name} style={{
                    background: bgStyle,
                    padding: "24px",
                    borderRadius: "24px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "default"
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700", color: "#1e293b" }}>{sub.name}</h3>
                      <span style={{
                        background: isGood ? "#dcfce7" : "#fee2e2",
                        color: isGood ? "#15803d" : "#b91c1c",
                        padding: "6px 14px", borderRadius: "999px", fontWeight: "700", fontSize: "0.9rem",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}>
                        {sub.percentage}%
                      </span>
                    </div>
                    <div style={{ height: "220px", position: "relative" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sub.data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={6}
                            dataKey="value"
                            cornerRadius={6}
                            stroke="none"
                          >
                            {sub.data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.name === "Present" ? (isGood ? "#22c55e" : "#f59e0b") : "#cbd5e1"} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                            itemStyle={{ fontWeight: 600 }}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Centered Text */}
                      <div style={{
                        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -60%)",
                        textAlign: "center", pointerEvents: "none"
                      }}>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "600" }}>Total</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#334155" }}>
                          {sub.data[0].value + sub.data[1].value}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Attendance Trend */}
          <section style={{ marginBottom: "56px" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#334155", marginBottom: "24px" }}>Monthly Trends 📅</h2>
            <div style={{
              background: "white",
              padding: "32px",
              borderRadius: "24px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f1f5f9",
              height: "450px"
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trendData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 13, fill: '#64748b' }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc', radius: 8 }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="present" name="Present" fill="#6366f1" radius={[6, 6, 6, 6]} barSize={20} />
                  <Bar dataKey="absent" name="Absent" fill="#e2e8f0" radius={[6, 6, 6, 6]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Detailed Log */}
          <section>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#334155", marginBottom: "24px" }}>Class History 📝</h2>
            <div style={{
              background: "white",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <tr>
                    <th style={{ padding: "20px 24px", textAlign: "left", color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Date</th>
                    <th style={{ padding: "20px 24px", textAlign: "left", color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Subject</th>
                    <th style={{ padding: "20px 24px", textAlign: "left", color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.sort((a, b) => new Date(b.date) - new Date(a.date)).map((r, idx) => (
                    <tr key={r.id} style={{
                      borderTop: idx === 0 ? "none" : "1px solid #f1f5f9",
                      transition: "background 0.1s"
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                    >
                      <td style={{ padding: "20px 24px", color: "#334155", fontWeight: "500" }}>
                        {new Date(r.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                      </td>
                      <td style={{ padding: "20px 24px", fontWeight: "600", color: "#1e293b" }}>{r.subject}</td>
                      <td style={{ padding: "20px 24px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "6px",
                          padding: "6px 14px", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700",
                          background: r.status === "present" ? "#dcfce7" : "#fee2e2",
                          color: r.status === "present" ? "#166534" : "#991b1b"
                        }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "currentColor" }}></span>
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
