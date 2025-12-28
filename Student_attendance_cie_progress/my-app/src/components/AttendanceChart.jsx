import React from "react";

// Props: timeline = [{date: 'YYYY-MM-DD', val: 0|100}, ...]
export default function AttendanceChart({ timeline = [] , width=600, height=140 }) {
  if (!Array.isArray(timeline) || timeline.length === 0) {
    return <div>No chart data</div>;
  }

  // sort by date
  const pts = [...timeline].sort((a,b)=> new Date(a.date) - new Date(b.date));

  const padding = 20;
  const w = width;
  const h = height;
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;

  const stepX = innerW / Math.max(1, pts.length - 1);

  const points = pts.map((p, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - (p.val / 100)) * innerH;
    return `${x},${y}`;
  }).join(" ");

  const total = pts.length;
  const present = pts.filter(p=>p.val===100).length;
  const percent = total ? Math.round((present/total)*100) : 0;

  return (
    <div style={{maxWidth: w}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <strong>Attendance: {percent}%</strong>
        <small>{pts[0].date} → {pts[pts.length-1].date}</small>
      </div>
      <svg width={w} height={h} style={{background:'#fff'}}>
        {/* grid lines */}
        <line x1={padding} y1={padding} x2={w-padding} y2={padding} stroke="#eee" />
        <line x1={padding} y1={padding+innerH/2} x2={w-padding} y2={padding+innerH/2} stroke="#f5f5f5" />
        <line x1={padding} y1={h-padding} x2={w-padding} y2={h-padding} stroke="#eee" />

        {/* polyline */}
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* points */}
        {pts.map((p,i)=>{
          const x = padding + i * stepX;
          const y = padding + (1 - (p.val / 100)) * innerH;
          return <circle key={i} cx={x} cy={y} r={3} fill={p.val===100 ? '#10b981' : '#ef4444'} />;
        })}
      </svg>
    </div>
  );
}
