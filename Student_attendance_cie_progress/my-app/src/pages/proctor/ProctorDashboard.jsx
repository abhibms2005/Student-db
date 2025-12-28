import React, { useEffect, useState } from "react";
import store from "../../utils/storage";

export default function ProctorDashboard() {
  const [proctor, setProctor] = useState(null);
  const [students, setStudents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const data = store.read();
    const logged = data.users.find(u => u.role === "proctor");
    setProctor(logged);
    if (!logged) return;

    // Assigned students
    const assigned = data.students.filter(s => s.proctorId === logged.id);
    setStudents(assigned);

    // Pending requests
    const pending = data.students.filter(
      s => s.requestedProctor === logged.email && !s.proctorId
    );
    setPendingRequests(pending);
  }, []);

  // Approve student
  function approveStudent(st) {
    const data = store.read();
    const idx = data.students.findIndex(x => x.id === st.id);
    if (idx !== -1) {
      data.students[idx].proctorId = proctor.id;
      delete data.students[idx].requestedProctor;
      store.write(data);

      setStudents(prev => [...prev, st]);
      setPendingRequests(prev => prev.filter(x => x.id !== st.id));
    }
  }

  // Reject student
  function rejectStudent(st) {
    const data = store.read();
    const idx = data.students.findIndex(x => x.id === st.id);
    if (idx !== -1) {
      delete data.students[idx].requestedProctor; // remove request
      store.write(data);

      setPendingRequests(prev => prev.filter(x => x.id !== st.id));
    }
  }

  if (!proctor)
    return <div style={{ padding: 20 }}>Login as a proctor to continue</div>;

  return (
    <div style={{ display: "grid", gap: 20, padding: 20 }}>
      {/* Welcome Card */}
      <div className="card">
        <h2>Welcome, {proctor.name}</h2>
      </div>

      {/* Assigned Students */}
      <div className="card">
        <h3>Your Students ({students.length})</h3>
        <div
          className="table-container"
          style={{ maxHeight: 400, overflowY: "auto" }}
        >
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Mail</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="small muted">
                    No students assigned.
                  </td>
                </tr>
              ) : (
                students.map(st => (
                  <tr key={st.id}>
                    <td>{st.name}</td>
                    <td>{st.roll}</td>
                    <td>{st.email}</td>
                    <td>{st.phone || "-"}</td>
                    <td>
                      <a
                        href={`mailto:${st.email}`}
                        className="btn btn-ghost"
                        style={{ padding: "6px 10px", fontSize: "0.85rem" }}
                      >
                        Email
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="card">
        <h3>Pending Requests ({pendingRequests.length})</h3>
        <div
          className="table-container"
          style={{ maxHeight: 400, overflowY: "auto" }}
        >
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="small muted">
                    No pending requests.
                  </td>
                </tr>
              ) : (
                pendingRequests.map(st => (
                  <tr key={st.id}>
                    <td>{st.name}</td>
                    <td>{st.roll}</td>
                    <td>{st.email}</td>
                    <td style={{ display: "flex", gap: "8px" }}>
                      {/* Approve button */}
                      <button
                        className="btn btn-success"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                        onClick={() => approveStudent(st)}
                      >
                        ✔️ Accept
                      </button>

                      {/* Reject button */}
                      <button
                        className="btn btn-danger"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                        onClick={() => rejectStudent(st)}
                      >
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
