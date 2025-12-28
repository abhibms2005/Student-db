import React from "react";

export default function SubjectCard({ subject, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        background: selected ? "#cce5ff" : "#fff"
      }}
    >
      <h5>{subject.name}</h5>
      <small>{subject.code}</small>
    </div>
  );
}
