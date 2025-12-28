// src/pages/Proctor/Certificates.js
import React, { useEffect, useState } from "react";
import store from "../../utils/storage";

export default function Certificates() {
  const [activityCerts, setActivityCerts] = useState([]);
  const [attendanceCerts, setAttendanceCerts] = useState([]);
  const [proctor, setProctor] = useState(null);
  const [studentsMap, setStudentsMap] = useState({});

  useEffect(() => {
    const data = store.read();

    // Find the proctor (assuming only one proctor is logged in for demo)
    const logged = data.users.find(u => u.role === "proctor");
    setProctor(logged);
    if (!logged) return;

    // Map students by ID for fast lookup
    const map = {};
    (data.students || []).forEach(s => map[s.id] = s);
    setStudentsMap(map);

    // Pending medical/attendance certificates
    const pendingCerts = (data.certificates || []).filter(c => {
      const student = map[c.studentId];
      return student?.proctorId === logged.id && !c.forwarded;
    });

    // Pending activity certificates
    const pendingActivityCerts = (data.activityCertificates || []).filter(c => {
      const student = map[c.studentId];
      return student?.proctorId === logged.id && c.status === "pending";
    });

    setAttendanceCerts(pendingCerts);
    setActivityCerts(pendingActivityCerts);
  }, []);

  const forwardToFaculty = (cert, isActivity = false) => {
    const data = store.read();

    if (isActivity) {
      const updated = data.activityCertificates.map(c =>
        c.id === cert.id ? { ...c, status: "forwarded" } : c
      );
      data.activityCertificates = updated;
      store.write(data);
      setActivityCerts(updated.filter(c => c.status === "pending"));
    } else {
      const updated = data.certificates.map(c =>
        c.id === cert.id ? { ...c, forwarded: true, facultyId: "f1" } : c
      );
      data.certificates = updated;
      store.write(data);
      setAttendanceCerts(updated.filter(c => !c.forwarded));
    }
  };

  if (!proctor)
    return <div className="card">Login as Proctor to view certificates</div>;

  const renderTable = (certs, title, isActivity = false) => (
    <div className="card" style={{ marginTop: 20 }}>
      <h3>{title} ({certs.length})</h3>
      {certs.length === 0 ? (
        <p className="small muted">No certificates to review.</p>
      ) : (
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>{isActivity ? "Type / Points" : "Type"}</th>
              <th>Date</th>
              <th>Reason</th>
              <th>File</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {certs.map(c => {
              const student = studentsMap[c.studentId];
              return (
                <tr key={c.id}>
                  <td>{student?.name || "-"}</td>
                  <td>{isActivity ? `${c.type} (${c.points || 0})` : c.type}</td>
                  <td>{c.date}</td>
                  <td>{c.reason || c.rejectReason || "-"}</td>
                  <td>
                    <a href={c.file} target="_blank" rel="noreferrer">View</a>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => forwardToFaculty(c, isActivity)}
                    >
                      Forward to Faculty
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div>
      {renderTable(activityCerts, "Activity Certificates", true)}
      {renderTable(attendanceCerts, "Medical / Attendance Certificates")}
    </div>
  );
}
