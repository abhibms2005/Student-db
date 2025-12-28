import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";

export default function FacultyReports(){
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState("");

  useEffect(()=>{ api.listStudents().then(setStudents); },[]);

  function openStudent(s){
    setSelected(s);
    setMessage("");
    setSent("");
  }

  function sendMessage(){
    // mock send — in real app integracate email/sms
    setSent(`Message sent to ${selected.email}: "${message}"`);
    setMessage("");
    setTimeout(()=>setSent(""), 4000);
  }

  return (
    <div style={{display:"grid", gap:16, gridTemplateColumns:"1fr 420px"}}>
      <div className="card">
        <h3>Class Summary</h3>
        <table className="table" style={{marginTop:10}}>
          <thead><tr><th>Student</th><th>Records</th><th>Avg</th></tr></thead>
          <tbody>
            {students.map(s => {
              const avg = ((s.cie_marks || []).reduce((acc,m)=>acc + (m.obtained ?? 0),0) / Math.max(1,(s.cie_marks || []).length)).toFixed(2);
              return <tr key={s.id}>
                <td><button className="btn btn-ghost" onClick={()=>openStudent(s)} style={{padding:"6px 8px"}}>{s.name}</button></td>
                <td>{(s.cie_marks || []).length}</td>
                <td>{avg}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Messaging</h3>
        {!selected && <div className="small muted">Select a student to message.</div>}
        {selected && (
          <>
            <div className="small muted">To: {selected.name} • {selected.email}</div>
            <textarea className="textarea" rows={6} value={message} onChange={e=>setMessage(e.target.value)} style={{marginTop:8}} />
            <div style={{marginTop:8, display:"flex", gap:8}}>
              <button className="btn btn-primary" onClick={sendMessage} disabled={!message}>Send</button>
              <a className="btn btn-ghost" href={`mailto:${selected.email}`} style={{padding:"6px 10px"}}>Open mail client</a>
            </div>
            {sent && <div style={{marginTop:8}} className="small muted">{sent}</div>}
          </>
        )}
      </div>
    </div>
  );
}
