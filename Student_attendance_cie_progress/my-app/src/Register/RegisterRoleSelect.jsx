import React from "react";
import { Link } from "react-router-dom";
import "./RoleSelect.css"; // Create this file

export default function RegisterRoleSelect() {
  return (
    <div className="role-select-container">
      <div className="role-select-card">
        <div className="header">
          <h1>Join Our Platform</h1>
          <p>Select your role to begin your registration</p>
        </div>

        <div className="roles-container">
          <Link to="/register/student" className="role-card student-card">
            <div className="role-icon">🎓</div>
            <div className="role-content">
              <h3>Student</h3>
              <p>Access courses, assignments, and learning materials</p>
            </div>
            <div className="role-arrow">→</div>
          </Link>

          <Link to="/register/faculty" className="role-card faculty-card">
            <div className="role-icon">👨‍🏫</div>
            <div className="role-content">
              <h3>Faculty</h3>
              <p>Manage courses, create content, and engage with students</p>
            </div>
            <div className="role-arrow">→</div>
          </Link>
        </div>

        <div className="divider">
          <span>Already registered?</span>
        </div>

        <Link to="/login" className="login-link">
          Sign in to your account
        </Link>
      </div>
    </div>
  );
}