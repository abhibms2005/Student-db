import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function Progress() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [form, setForm] = useState({
    subjectId: "",
    cieNo: 1,
    expected: "",
    obtained: "",
    total: "",
  });
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  // Fetch subjects, marks, and reasons
  useEffect(() => {
    api.listSubjects().then(setSubjects);
    if (user) {
      api.getStudentData(user.id).then((d) => setMarks(d.cie_marks));
      api.listReasons().then(setReasons);
    }
  }, [user]);

  async function submit(e) {
    e.preventDefault();
    if (!form.subjectId) return alert("Please select a subject.");

    const payload = {
      studentId: user.id,
      subjectId: form.subjectId,
      cieNo: Number(form.cieNo),
      expected: Number(form.expected || 0),
      obtained: form.obtained ? Number(form.obtained) : null,
      date: new Date().toISOString().slice(0, 10),
    };

    // Check if reason is required
    if (
      payload.obtained !== null &&
      payload.expected > payload.obtained &&
      !reason.trim()
    ) {
      alert("Please provide a reason for not reaching expected marks.");
      return;
    }

    await api.addCieMark(payload);

    if (payload.expected > payload.obtained) {
      await api.addReason({
        id: "R" + Math.random().toString(36).slice(2, 9),
        studentId: user.id,
        subjectId: form.subjectId,
        cieNo: Number(form.cieNo),
        reason,
        facultyReply: null,
        seenByStudent: false,
      });
      setReason("");
    }

    const d = await api.getStudentData(user.id);
    setMarks(d.cie_marks);
    const r = await api.listReasons();
    setReasons(r);

    setMsg("Saved!");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div className="progress-container">
      {/* --- Add CIE Record --- */}
      <div className="card">
        <h3>Add CIE record</h3>
        <form onSubmit={submit} className="cie-form">
          <div className="cie-fields">
            <div className="cie-field">
              <label>Select subject: </label>
              <select
                className="progress-dropdown"
                value={form.subjectId}
                onChange={(e) =>
                  setForm({ ...form, subjectId: e.target.value })
                }
              >
                <option value="">Select subject: </option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="cie-field">
              <label>CIE No: </label>
              <input
                className="cie-input cie-no"
                type="number"
                value={form.cieNo}
                onChange={(e) =>
                  setForm({ ...form, cieNo: e.target.value })
                }
                placeholder="CIE No."
              />
            </div>

            <div className="cie-field">
              <label>Expected Marks: </label>
              <input
                className="cie-input expected-input"
                type="number"
                value={form.expected}
                onChange={(e) =>
                  setForm({ ...form, expected: e.target.value })
                }
                placeholder="Expected Marks"
              />
            </div>

            <div className="cie-field">
              <label>Obtained Marks: </label>
              <input
                className="cie-input obtained-input"
                type="number"
                value={form.obtained}
                onChange={(e) =>
                  setForm({ ...form, obtained: e.target.value })
                }
                placeholder="Obtained Marks"
              />
            </div>
          <div className="cie-field">
              <label>Total Marks: </label>
              <input
                className="cie-input obtained-input"
                type="number"
                value={form.total}
                onChange={(e) =>
                  setForm({ ...form, total: e.target.value })
                }
                placeholder="Total marks"
              />
            </div>
          </div>
          {/* Reason input appears only if obtained < expected */}
          {form.obtained &&
            form.expected &&
            Number(form.obtained) < Number(form.expected) && (
              <div className="cie-field full-width">
                <label>Reason</label>
                <textarea
                  className="cie-input cie-reason"
                  placeholder="Reason for not reaching expected marks"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            )}

          <div className="form-actions">
            <button className="save-cie-btn" type="submit">
              Save CIE
            </button>
            {msg && <span className="msg">{msg}</span>}
          </div>
        </form>
      </div>

      {/* --- CIE Records Table --- */}
      <div className="card">
        <h3>Your CIE Records</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>CIE</th>
              <th>Expected</th>
              <th>Obtained</th>
              <th>Total</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Faculty Reply</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((m, i) => {
              const r = reasons.find(
                (x) =>
                  x.studentId === m.studentId &&
                  x.subjectId === m.subjectId &&
                  x.cieNo === m.cieNo
              );
              return (
                <tr key={i}>
                  <td>
                    {subjects.find((s) => s.id === m.subjectId)?.name ||
                      m.subjectId}
                  </td>
                  <td>{m.cieNo}</td>
                  <td>{m.expected}</td>
                  <td>{m.obtained ?? "-"}</td>
                  <td>{m.total}</td>
                  <td>{m.date}</td>
                  <td className="scroll-box">{r?.reason || "-"}</td>
                  <td className="scroll-box">{r?.facultyReply || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
