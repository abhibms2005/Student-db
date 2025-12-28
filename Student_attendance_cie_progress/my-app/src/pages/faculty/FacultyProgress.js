import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import store from "../../utils/storage";

export default function FacultyProgress() {
  const { user } = useAuth();
  const [reasons, setReasons] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [replies, setReplies] = useState({});

  // Load initial data
  useEffect(() => {
    (async () => {
      const s = await store.read();
      setStudents(s.students || []);
      setSubjects(s.subjects || []);
      const rs = await api.listReasons();
      setReasons(rs || []);
    })();
  }, []);

  // Send faculty reply to a specific reason
  async function sendReply(reasonId) {
    if (!replies[reasonId]) return;
    await api.addReasonReply(reasonId, replies[reasonId], user?.name || "Faculty");
    const updated = await api.listReasons();
    setReasons(updated);
    setReplies({ ...replies, [reasonId]: "" });
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">📊 Manage Student CIE Marks</h2>
      <table className="table w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-gray-100">
            <th className="p-2 text-left">Student</th>
            <th className="p-2 text-left">Subject</th>
            <th className="p-2 text-left">CIE No</th>
            <th className="p-2 text-left">Reason (from Student)</th>
            <th className="p-2 text-left">Reply to Student</th>
          </tr>
        </thead>
        <tbody>
          {reasons.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-400">
                No student reasons submitted yet.
              </td>
            </tr>
          ) : (
            reasons.map((r) => {
              const student = students.find((s) => s.id === r.studentId);
              const subject = subjects.find((s) => s.id === r.subjectId);
              return (
                <tr key={r.id} className="border-b border-gray-700">
                  <td className="p-2">{student?.name || "-"}</td>
                  <td className="p-2">{subject?.name || "-"}</td>
                  <td className="p-2">{r.cieNo}</td>
                  <td className="p-2">{r.reason || "-"}</td>
                  <td className="p-2">
                    {r.facultyReply ? (
                      <em className="text-green-400">{r.facultyReply}</em>
                    ) : (
                      <div className="flex flex-col">
                        <textarea
                          className="p-1 border border-gray-600 rounded bg-gray-900 text-white mb-1"
                          rows="2"
                          value={replies[r.id] || ""}
                          onChange={(e) =>
                            setReplies({ ...replies, [r.id]: e.target.value })
                          }
                          placeholder="Write your reply..."
                        />
                        <button
                          onClick={() => sendReply(r.id)}
                          className="bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
