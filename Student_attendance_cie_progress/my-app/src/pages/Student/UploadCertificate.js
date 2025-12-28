// src/pages/Student/UploadCertificate.js
import React, { useState } from "react";
import store from "../../utils/storage";

export default function UploadCertificate() {
  const [form, setForm] = useState({ type: "medical", file: null, reason: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = store.read();
    const student = data.students?.[0]; // assuming logged in student

    if (!form.file) return alert("Please select a file");

    const newCert = {
      id: "c" + Math.random().toString(36).slice(2, 9),
      studentId: student.id,
      type: form.type,
      file: URL.createObjectURL(form.file), // or handle upload
      date: new Date().toISOString().slice(0, 10),
      forwarded: false,
      facultyId: null,
      reason: form.reason
    };

    data.certificates = data.certificates || [];
    data.certificates.push(newCert);

    store.write(data);
    setMsg("Certificate uploaded successfully!");
    setForm({ type: "medical", file: null, reason: "" });

    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="card">
      <h3>Upload Certificate</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="medical">Medical Certificate</option>
          <option value="event">Event Certificate</option>
        </select>

        <input
          type="file"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
        />

        <input
          type="text"
          placeholder="Reason (optional)"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <button className="btn btn-primary" type="submit">
          Upload
        </button>
        {msg && <span className="small muted">{msg}</span>}
      </form>
    </div>
  );
}
