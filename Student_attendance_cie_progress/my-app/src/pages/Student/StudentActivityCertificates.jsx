import React, { useEffect, useState, useLayoutEffect } from "react";
import store from "../../utils/storage";
import "./StudentActivityCertificates.css";

export default function StudentActivityCertificates() {
  const [student, setStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activityType, setActivityType] = useState("");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [isDragging, setIsDragging] = useState(false);

  // Detect theme change
  useLayoutEffect(() => {
    const detectTheme = () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    };

    detectTheme();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          detectTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Load student info and previous submissions
  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = () => {
    setIsLoading(true);
    const data = store.read();
    const loggedStudent = data.users.find(u => u.role === "student");
    
    if (!loggedStudent) {
      setIsLoading(false);
      return;
    }

    setStudent(loggedStudent);

    // Load activityCertificates only
    const studentSubmissions = (data.activityCertificates || [])
      .filter(c => c.studentId === loggedStudent.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setSubmissions(studentSubmissions);

    const points = studentSubmissions
      .filter(c => c.status === "approved")
      .reduce((acc, c) => acc + (c.points || 0), 0);
    setTotalPoints(points);
    setIsLoading(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activityType.trim()) {
      alert("Please enter activity type.");
      return;
    }
    
    if (!file) {
      alert("Please upload a certificate file.");
      return;
    }

    const newCert = {
      id: "ac" + Date.now(),
      studentId: student.id,
      type: activityType.trim(),
      date: new Date().toISOString().split("T")[0],
      file: URL.createObjectURL(file),
      notes: notes.trim(),
      status: "pending",
      points: 0
    };

    // Store in activityCertificates array
    store.addActivityCertificate(newCert);

    setSubmissions(prev => [newCert, ...prev]);
    setActivityType("");
    setFile(null);
    setNotes("");
    loadStudentData(); // Refresh data
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="student-certificates-container" data-theme={theme}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-certificates-container" data-theme={theme}>
        <div className="not-logged-in">
          <div className="not-logged-in-content">
            <h2>🔒 Access Required</h2>
            <p>Please login as a student to view activity certificates</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-certificates-container" data-theme={theme}>
      {/* Header Section */}
      <div className="student-header">
        <div className="student-header-content">
          <h1>Activity Certificates</h1>
          <p>Submit and track your activity certificates</p>
        </div>
        <div className="student-info-card">
          <div className="student-avatar-large">
            {getInitials(student.name)}
          </div>
          <div className="student-details-large">
            <h3>{student.name}</h3>
            <p>Student ID: {student.id}</p>
          </div>
        </div>
      </div>

      {/* Points Card */}
      <div className="points-card">
        <div className="points-card-header">
          <h2>Total Activity Points</h2>
          <div className="points-card-icon">🏆</div>
        </div>
        <p className="points-value">{totalPoints}</p>
        <p className="points-label">Points earned from approved certificates</p>
      </div>

      {/* Main Content - Form and Stats */}
      <div className="student-content">
        {/* Submission Form */}
        <div className="form-section">
          <h2>
            <span>📝</span>
            Submit New Certificate
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📋</span>
                Activity Type
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Sports, Cultural, Academic"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📎</span>
                Certificate File
              </label>
              <div 
                className={`file-upload ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="file-upload-input"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <div className="file-upload-icon">📤</div>
                  <div className="file-upload-text">
                    <h4>Upload Certificate</h4>
                    <p>Drag & drop or click to browse</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      Supports: JPG, PNG, PDF (Max 10MB)
                    </p>
                  </div>
                </label>
              </div>
              
              {file && (
                <div className="file-preview">
                  <div className="file-preview-icon">📄</div>
                  <div className="file-preview-info">
                    <h5>{file.name}</h5>
                    <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📝</span>
                Additional Notes (Optional)
              </label>
              <textarea
                className="form-input"
                placeholder="Add any additional information about this activity..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={!activityType || !file}
            >
              <span>📤</span>
              Submit Certificate
            </button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="form-section">
          <h2>
            <span>📊</span>
            Submission Stats
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Submissions</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{submissions.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Approved</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--success-color)' }}>{submissions.filter(c => c.status === "approved").length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Pending</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--warning-color)' }}>{submissions.filter(c => c.status === "pending").length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Rejected</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--danger-color)' }}>{submissions.filter(c => c.status === "rejected").length}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '24px', padding: '20px', background: 'var(--primary-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>💡</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Tips for Approval</span>
            </div>
            <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              <li>Upload clear, readable images</li>
              <li>Include relevant details in notes</li>
              <li>Submit certificates promptly after activity</li>
              <li>Follow your institution's guidelines</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="submissions-section">
        <div className="submissions-header">
          <h2>
            <span>📋</span>
            Submission History
          </h2>
          <span className="submissions-count">{submissions.length} submissions</span>
        </div>

        {submissions.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📄</div>
            <h3>No Submissions Yet</h3>
            <p>Submit your first activity certificate to get started</p>
          </div>
        ) : (
          <div className="submissions-table-wrapper">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>Activity Type</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Points</th>
                  <th>Notes / Reason</th>
                  <th>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(cert => (
                  <tr key={cert.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cert.type}</div>
                    </td>
                    <td>{cert.date}</td>
                    <td>
                      <span className={`status-badge status-${cert.status}`}>
                        <span className="status-indicator"></span>
                        {cert.status}
                      </span>
                    </td>
                    <td>
                      {cert.status === "approved" ? (
                        <span className="points-cell">+{cert.points || 0}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
                    <td className="reason-cell">
                      {cert.status === "rejected" ? (
                        <div className="reason-text">{cert.rejectReason || "No reason provided"}</div>
                      ) : cert.notes ? (
                        <div className="reason-text">{cert.notes}</div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
                    <td>
                      <a href={cert.file} target="_blank" rel="noreferrer" className="file-link">👁️ View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
