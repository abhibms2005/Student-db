import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import store from "../../utils/storage";

export default function FacultyDashboard(){
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ total:0, aboveExpected:0, belowExpected:0, average:0 });
  const [certificates, setCertificates] = useState([]);

  useEffect(()=> {
    async function load(){
      const s = await api.listStudents();
      setStudents(s);

      let total = 0, above = 0, below = 0, avg = 0;
      s.forEach(stu => {
        stu.cie_marks?.forEach(m => {
          total++;
          avg += (m.obtained ?? 0);
          if ((m.obtained ?? -1) >= (m.expected ?? 0)) above++;
          else below++;
        });
      });
      avg = total ? (avg / total).toFixed(2) : 0;
      setSummary({ total, aboveExpected: above, belowExpected: below, average: avg });

      // Certificates forwarded to this faculty
      const st = store.read();
      const forwarded = st.certificates?.filter(c => c.facultyId === user.id && c.forwarded) || [];
      setCertificates(forwarded);
    }
    load();
  },[]);

  return (
    <div style={{display:"grid", gap:16}}>
      {/* Faculty Performance Overview */}
      <div className="card">
        <h3>Faculty Performance Overview</h3>
        <div className="row" style={{marginTop:12}}>
          <div className="card" style={{flex:1, minWidth:160}}><div className="small muted">Total Records</div><div className="kpi">{summary.total}</div></div>
          <div className="card" style={{flex:1, minWidth:160}}><div className="small muted">Above Expected</div><div className="kpi" style={{color:"var(--primary)"}}>{summary.aboveExpected}</div></div>
          <div className="card" style={{flex:1, minWidth:160}}><div className="small muted">Below Expected</div><div className="kpi" style={{color:"var(--accent)"}}>{summary.belowExpected}</div></div>
          <div className="card" style={{flex:1, minWidth:160}}><div className="small muted">Average Marks</div><div className="kpi">{summary.average}</div></div>
        </div>
      </div>

      {/* At-Risk Students */}
      <div className="card">
        <h3>At-Risk Students</h3>
        <table className="table" style={{marginTop:10}}>
          <thead><tr><th>Student</th><th>Subject</th><th>Expected</th><th>Obtained</th><th>Total</th><th>Contact</th></tr></thead>
          <tbody>
            {students.flatMap(stu => (stu.cie_marks || []).filter(m => (m.obtained ?? -1) < (m.expected ?? 0)).map((m,i)=>(
              <tr key={`${stu.id}-${i}`}><td>{stu.name}</td><td>{m.subjectId}</td><td>{m.expected}</td><td>{m.obtained ?? "-"}</td><td>{m.total}</td><td><a className="btn btn-ghost" style={{padding:"6px 10px", fontSize:"0.85rem"}} href={`mailto:${stu.email}`}>Email</a></td></tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Certificates Forwarded */}
      <div className="card">
        <h3>Certificates Forwarded to You ({certificates.length})</h3>
        {certificates.length === 0 ? (
          <p className="small muted">No certificates forwarded.</p>
        ) : (
          <table className="table" style={{marginTop:12}}>
            <thead>
              <tr><th>Student</th><th>Type</th><th>Date</th><th>Reason</th><th>File</th></tr>
            </thead>
            <tbody>
              {certificates.map(c => {
                const student = students.find(s => s.id === c.studentId);
                return (
                  <tr key={c.id}>
                    <td>{student?.name}</td>
                    <td>{c.type}</td>
                    <td>{c.date}</td>
                    <td>{c.reason || "-"}</td>
                    <td><a href={c.file} target="_blank" rel="noreferrer">View</a></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
