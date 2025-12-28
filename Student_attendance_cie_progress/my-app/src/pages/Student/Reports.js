import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function Reports(){
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(()=>{ if(user) api.getStudentData(user.id).then(setData); },[user]);

  function downloadJson(){
    const payload = { student: data.student, cie: data.cie_marks, attendance: data.attendance };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download = `${data.student.roll || "report"}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  if(!data) return <div className="card">Loading...</div>;

  return (
    <div style={{display:"grid", gap:16}}>
      <div className="card">
        <h3>Download Report</h3>
        <p className="small muted">JSON snapshot of student data. For production, integrate server-side PDF generation.</p>
        <button className="btn btn-primary" onClick={downloadJson}>Download JSON</button>
      </div>

      <div className="card">
        <h3>Snapshot</h3>
        <pre style={{maxHeight:300, overflow:"auto", background:"rgba(0,0,0,0.03)", padding:12, borderRadius:8}}>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
