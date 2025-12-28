import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../utils/auth";

export default function Admin(){
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);

  useEffect(()=>{ api.listLeaves().then(setLeaves); },[]);

  if(user?.role !== "faculty") return <div className="card">Access denied. Faculty only.</div>;

  async function act(id, approve){
    await api.approveLeave(id, approve);
    const l = await api.listLeaves();
    setLeaves(l);
  }

  return (
    <div style={{display:"grid", gap:16}}>
      <div className="card">
        <h3>Pending Leaves</h3>
        {leaves.filter(x=>x.status==="pending").length === 0 && <div className="small muted">No pending leaves.</div>}
        {leaves.filter(x=>x.status==="pending").map(l => (
          <div key={l.id} style={{borderTop:"1px solid rgba(0,0,0,0.04)", paddingTop:10, marginTop:10}}>
            <div><strong>{l.reason}</strong> • {l.from} → {l.to}</div>
            <div className="small muted">Student: {l.studentId} • Subject: {l.subjectId || "—"}</div>
            <div style={{marginTop:8, display:"flex", gap:8}}>
              <button className="btn btn-primary" onClick={()=>act(l.id,true)}>Approve</button>
              <button className="btn btn-ghost" onClick={()=>act(l.id,false)}>Reject</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>All Leaves</h3>
        <table className="table" style={{marginTop:10}}>
          <thead><tr><th>Student</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l.id}><td>{l.studentId}</td><td>{l.from}</td><td>{l.to}</td><td>{l.reason}</td><td>{l.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
