import React, { useEffect, useState, useLayoutEffect } from "react";
import store from "../../utils/storage";
import "./ProctorActivityCertificates.css";

export default function ProctorActivityCertificates() {
  const [proctor, setProctor] = useState(null);
  const [pendingCertificates, setPendingCertificates] = useState([]);
  const [previousCertificates, setPreviousCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

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

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = () => {
    setIsLoading(true);
    const data = store.read();
    const logged = data.users.find(u => u.role === "proctor");
    setProctor(logged);

    if (!logged) {
      setIsLoading(false);
      return;
    }

    const pending = (data.activityCertificates || []).filter(c => {
      const student = data.students.find(s => s.id === c.studentId);
      return student?.proctorId === logged.id && c.status === "pending";
    });

    const previous = (data.activityCertificates || []).filter(c => {
      const student = data.students.find(s => s.id === c.studentId);
      return student?.proctorId === logged.id && c.status !== "pending";
    });

    setPendingCertificates(pending);
    setPreviousCertificates(previous);
    setIsLoading(false);
  };

  const handleReviewClick = (cert) => {
    setSelectedCertificate(cert);
    setPoints("");
    setReason("");
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    if (!points || points < 0) {
      alert("Please enter valid points before approving.");
      return;
    }

    const data = store.read();
    const idx = data.activityCertificates.findIndex(c => c.id === selectedCertificate.id);
    if (idx !== -1) {
      data.activityCertificates[idx].status = "approved";
      data.activityCertificates[idx].points = parseInt(points);

      // Update student activity points
      const studentIdx = data.students.findIndex(s => s.id === data.activityCertificates[idx].studentId);
      if (studentIdx !== -1) {
        if (!data.students[studentIdx].activityPoints) data.students[studentIdx].activityPoints = 0;
        data.students[studentIdx].activityPoints += parseInt(points);
      }

      store.write(data);
      loadCertificates();
      setIsModalOpen(false);
    }
  };

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    const data = store.read();
    const idx = data.activityCertificates.findIndex(c => c.id === selectedCertificate.id);
    if (idx !== -1) {
      data.activityCertificates[idx].status = "rejected";
      data.activityCertificates[idx].rejectReason = reason.trim();

      store.write(data);
      loadCertificates();
      setIsModalOpen(false);
    }
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
      <div className="proctor-dashboard-container" data-theme={theme}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!proctor) {
    return (
      <div className="proctor-dashboard-container" data-theme={theme}>
        <div className="not-logged-in">
          <div className="not-logged-in-content">
            <h2>🔒 Access Required</h2>
            <p>Please login as a proctor to view activity certificates</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="proctor-dashboard-container" data-theme={theme}>
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Activity Certificates Dashboard</h1>
            <p>Review and manage student activity submissions</p>
          </div>
          <div className="proctor-info">
            <div className="proctor-avatar">
              {getInitials(proctor.name)}
            </div>
            <div className="proctor-details">
              <h3>{proctor.name}</h3>
              <p>Proctor ID: {proctor.id}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card pending">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Pending Certificates</h3>
              <p className="stat-value">{pendingCertificates.length}</p>
            </div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Approved</h3>
              <p className="stat-value">
                {previousCertificates.filter(c => c.status === "approved").length}
              </p>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>Rejected</h3>
              <p className="stat-value">
                {previousCertificates.filter(c => c.status === "rejected").length}
              </p>
            </div>
          </div>
          <div className="stat-card students">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Students</h3>
              <p className="stat-value">
                {new Set(previousCertificates.map(c => c.studentId)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Pending Certificates Section */}
          <div className="section-title">
            <h2>Pending Certificates</h2>
            <span className="badge">
              {pendingCertificates.length} pending
            </span>
          </div>

          {pendingCertificates.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📄</div>
              <h3>No Pending Certificates</h3>
              <p>All certificate submissions have been reviewed</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="certificates-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Activity Type</th>
                    <th>Submitted Date</th>
                    <th>Document</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCertificates.map(cert => {
                    const data = store.read();
                    const student = data.students.find(s => s.id === cert.studentId);
                    const studentName = student?.name || "Unknown Student";

                    return (
                      <tr key={cert.id}>
                        <td>
                          <div className="student-cell">
                            <div className="student-avatar-small">
                              {getInitials(studentName)}
                            </div>
                            <div className="student-info-small">
                              <h4>{studentName}</h4>
                              <p>Student ID: {cert.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="activity-badge">{cert.type}</span>
                        </td>
                        <td className="date-cell">{cert.date}</td>
                        <td>
                          <a
                            href={cert.file}
                            target="_blank"
                            rel="noreferrer"
                            className="file-link"
                          >
                            📎 View
                          </a>
                        </td>
                        <td>
                          <button
                            className="review-btn"
                            onClick={() => handleReviewClick(cert)}
                          >
                            📝 Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Previous Certificates Section */}
          <div className="previous-section">
            <div className="section-title">
              <h2>Previous Decisions</h2>
              <span className="badge">
                {previousCertificates.length} total
              </span>
            </div>

            {previousCertificates.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📋</div>
                <h3>No Previous Decisions</h3>
                <p>No certificates have been reviewed yet</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="certificates-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Activity Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Points / Reason</th>
                      <th>Document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousCertificates.map(cert => {
                      const data = store.read();
                      const student = data.students.find(s => s.id === cert.studentId);

                      return (
                        <tr key={cert.id} className={`status-${cert.status}`}>
                          <td>
                            <div className="student-cell">
                              <div className="student-avatar-small">
                                {getInitials(student?.name || '??')}
                              </div>
                              <div className="student-info-small">
                                <h4>{student?.name}</h4>
                                <p>ID: {cert.studentId}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="activity-badge">{cert.type}</span>
                          </td>
                          <td>{cert.date}</td>
                          <td className="status-cell">
                            <span className="status-indicator"></span>
                            <span className={`status-badge status-${cert.status}`}>
                              {cert.status}
                            </span>
                          </td>
                          <td>
                            {cert.status === "approved" ? (
                              <div className="points-cell">+{cert.points} pts</div>
                            ) : (
                              <div className="reason-text">{cert.rejectReason}</div>
                            )}
                          </td>
                          <td>
                            <a
                              href={cert.file}
                              target="_blank"
                              rel="noreferrer"
                              className="file-link"
                            >
                              📎 View
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedCertificate && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Certificate</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="review-student-info">
                <div className="review-avatar">
                  {(() => {
                    const data = store.read();
                    const student = data.students.find(s => s.id === selectedCertificate.studentId);
                    return getInitials(student?.name || "??");
                  })()}
                </div>
                <div className="review-student-details">
                  <h3>{(() => {
                    const data = store.read();
                    const student = data.students.find(s => s.id === selectedCertificate.studentId);
                    return student?.name || "Unknown Student";
                  })()}</h3>
                  <p>Student ID: {selectedCertificate.studentId}</p>
                </div>
              </div>

              <div className="certificate-details">
                <div className="detail-item">
                  <span className="detail-label">
                    📋 Activity Type
                  </span>
                  <span className="detail-value">{selectedCertificate.type}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    📅 Submitted Date
                  </span>
                  <span className="detail-value">{selectedCertificate.date}</span>
                </div>
              </div>

              <a
                href={selectedCertificate.file}
                target="_blank"
                rel="noreferrer"
                className="review-file-link"
              >
                👁️ View Certificate
              </a>

              <div className="review-form">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">⭐</span>
                    Assign Points
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    placeholder="Enter points (0-100)"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📝</span>
                    Rejection Reason
                  </label>
                  <textarea
                    className="form-input"
                    placeholder="Enter reason for rejection"
                    rows="3"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <div className="review-actions">
                  <button
                    className="review-btn-approve"
                    onClick={handleApprove}
                  >
                    <span>✓</span>
                    Approve Certificate
                  </button>
                  <button
                    className="review-btn-reject"
                    onClick={handleReject}
                  >
                    <span>✗</span>
                    Reject Submission
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}