// src/pages/Faculty/ViewCertificates.js
import React, { useEffect, useState } from "react";
import store from "../../utils/storage";

export default function ViewCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    const data = store.read();
    const logged = data.users.find((u) => u.role === "faculty");
    setFaculty(logged);

    if (!logged) return;

    const certs = (data.certificates || []).filter((c) => c.forwarded && c.facultyId === logged.id);
    setCertificates(certs);
  }, []);

  if (!faculty) return <div className="card">Login as Faculty to view certificates</div>;

  return (
    <div className="card">
      <h3>Certificates Forwarded by Proctor ({certificates.length})</h3>
      {certificates.length === 0 && <p className="small muted">No certificates forwarded to you.</p>}
      {certificates.length > 0 && (
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>Date</th>
              <th>Reason</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((c) => {
              const student = store.read().students.find((s) => s.id === c.studentId);
              return (
                <tr key={c.id}>
                  <td>{student?.name}</td>
                  <td>{c.type}</td>
                  <td>{c.date}</td>
                  <td>{c.reason || "-"}</td>
                  <td>
                    <a href={c.file} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
