import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function ProctorAttendance() {
  const { user } = useAuth(); // proctor
  const [leaves, setLeaves] = useState([]);
  const [students, setStudents] = useState([]);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const lv = await api.listLeaves(null, user.id);
    const st = await api.listStudents(user.id, "proctor");

    setLeaves(lv);
    setStudents(st);
  }

  function getStudent(studentId) {
    return students.find(s => s.id === studentId);
  }

  function attendancePercent(student) {
    if (!student || !student.attendance) return 100;

    const total = student.attendance.length;
    const present = student.attendance.filter(a => a.status === "present").length;

    return total === 0 ? 100 : Math.round((present / total) * 100);
  }

  async function approveLeave(leave) {
    const remark = remarks[leave.id] || "";

    await api.updateLeaveStatus(leave.id, "approved", remark);

    // create leave certificate
    await api.addCertificate({
      studentId: leave.studentId,
      facultyId: null,
      type: "Leave Approval",
      date: new Date().toISOString().slice(0, 10),
      reason: leave.reason,
      file: leave.docLink || null,
      forwarded: false
    });

    setRemarks(prev => ({ ...prev, [leave.id]: "" }));
    loadData();
  }

  async function rejectLeave(leave) {
    const remark = remarks[leave.id];

    if (!remark || remark.trim() === "") {
      alert("Rejection reason is mandatory");
      return;
    }

    await api.updateLeaveStatus(leave.id, "rejected", remark);

    setRemarks(prev => ({ ...prev, [leave.id]: "" }));
    loadData();
  }

  return (
    <div className="card">
      <h3>Leave Requests</h3>

      {leaves.length === 0 && (
        <div className="small muted">No leave requests</div>
      )}

      {leaves.map(l => {
        const student = getStudent(l.studentId);
        const percent = attendancePercent(student);

        return (
          <div
            key={l.id}
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12
            }}
          >
            <div>
              <strong>{student?.name}</strong> ({student?.roll})
            </div>

            <div className="small muted">
              {l.from} → {l.to}
            </div>

            <div>Reason: {l.reason}</div>

            <div className="small">
              Attendance: <strong>{percent}%</strong>
            </div>

            {l.docLink && (
              <div className="small">
                <a href={l.docLink}>View document</a>
              </div>
            )}

            <div className="small muted">Status: {l.status}</div>

            {l.status === "pending" && (
              <>
                <input
                  className="input"
                  placeholder="Remarks (required for reject)"
                  value={remarks[l.id] || ""}
                  onChange={e =>
                    setRemarks(prev => ({
                      ...prev,
                      [l.id]: e.target.value
                    }))
                  }
                  style={{ marginTop: 8 }}
                />

                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-success"
                    onClick={() => approveLeave(l)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => rejectLeave(l)}
                  >
                    Reject
                  </button>
                </div>
              </>
            )}

            {l.status === "rejected" && l.remarks && (
              <div className="small" style={{ color: "red" }}>
                Rejected Reason: {l.remarks}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
