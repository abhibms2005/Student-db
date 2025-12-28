import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
// If using auth context
// import { useAuth } from "../utils/auth";

export default function Login() {
  // In real app, you would use: const { login } = useAuth();
  const nav = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Demo credentials
  const demoCredentials = {
    student: { email: "student@university.edu", password: "student123" },
    faculty: { email: "faculty@university.edu", password: "faculty123" },
    proctor: { email: "proctor@university.edu", password: "proctor123" }
  };

  const handleDemoFill = () => {
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
    setError("");
  };

  async function submit(e) {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // In real app: const user = await login(email, password, role);
      // Simulating API call
      setTimeout(() => {
        console.log(`Logging in as ${role} with email: ${email}`);
        
        // Simulate successful login
        // Redirect based on role
        if (role === "faculty") {
          nav("/faculty/dashboard");
        } else if (role === "proctor") {
          nav("/proctor/dashboard");
        } else {
          nav("/student/dashboard");
        }
        
        setIsLoading(false);
      }, 1500);

    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header with Logo */}
        <div className="login-header">
          <div className="login-logo-circle">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15C19.2662 15.9248 18.9887 16.8191 18.5789 17.6474C18.1692 18.4758 17.6335 19.2262 16.995 19.8666C16.3565 20.507 15.6248 21.0281 14.8315 21.4079C14.0382 21.7878 13.1949 22.0212 12.3333 22.0993C11.4718 22.1774 10.6045 22.099 9.76823 21.8675C8.93198 21.636 8.13932 21.255 7.425 20.7407C6.71068 20.2264 6.08551 19.5865 5.57667 18.8495C5.06783 18.1124 4.68325 17.2894 4.44033 16.4177C4.19741 15.5459 4.09973 14.6388 4.15133 13.7347C4.20294 12.8305 4.40287 11.943 4.74267 11.1127C5.08247 10.2823 5.55696 9.52175 6.14467 8.86667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 18V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {/* Role Selection */}
        <div className="role-selection">
          <h3 className="role-selection-title">Select Role</h3>
          <div className="role-options">
            <button
              className={`role-option ${role === "student" ? "role-option-active" : ""}`}
              onClick={() => {
                setRole("student");
                setError("");
              }}
              type="button"
            >
              <div className="role-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14L21 9L12 4L3 9L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14L18.159 10.578C18.6986 10.2569 19.302 10.0577 19.926 9.994C20.55 9.9303 21.1806 10.0036 21.775 10.209C22.3694 10.4144 22.9138 10.7472 23.372 11.184C23.8302 11.6208 24.1916 12.1518 24.433 12.74C24.6743 13.3282 24.7898 13.9598 24.772 14.594C24.7542 15.2282 24.6035 15.8511 24.33 16.422C24.0564 16.9929 23.6663 17.4987 23.185 17.905C22.7037 18.3113 22.1424 18.609 21.54 18.779L12 22L2.46 18.779C1.85763 18.609 1.29627 18.3113 0.815 17.905C0.333733 17.4987 -0.0564319 16.9929 -0.33 16.422C-0.603568 15.8511 -0.754248 15.2282 -0.772 14.594C-0.789752 13.9598 -0.674259 13.3282 -0.433 12.74C-0.191741 12.1518 0.169566 11.6208 0.6278 11.184C1.08603 10.7472 1.6306 10.4144 2.225 10.209C2.8194 10.0036 3.45 9.9303 4.074 9.994C4.698 10.0577 5.30141 10.2569 5.841 10.578L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="role-label">Student</span>
            </button>

            <button
              className={`role-option ${role === "faculty" ? "role-option-active" : ""}`}
              onClick={() => {
                setRole("faculty");
                setError("");
              }}
              type="button"
            >
              <div className="role-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H5M19 21H21M5 21H3M9 7H15M9 11H15M13 21V17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="role-label">Faculty</span>
            </button>

            <button
              className={`role-option ${role === "proctor" ? "role-option-active" : ""}`}
              onClick={() => {
                setRole("proctor");
                setError("");
              }}
              type="button"
            >
              <div className="role-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.905 20.249C3.827 19.345 4.939 18.622 6.173 18.132C7.408 17.643 8.738 17.397 10.08 17.409C11.423 17.421 12.748 17.691 14.073 18.132C15.397 18.573 16.588 19.296 17.572 20.249" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 8L16 12L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="role-label">Proctor</span>
            </button>
          </div>
          
          <div className="role-note">
            <div className="note-icon">ℹ️</div>
            <p>Select the role you registered with. Each role has different dashboard access.</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={submit} className="login-form">
          {error && (
            <div className="login-error">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder={`Enter your ${role} email`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="form-input"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06M9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Remember me</span>
            </label>
            
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'submit-btn-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`
              )}
            </button>

            <button
              type="button"
              className="demo-btn"
              onClick={handleDemoFill}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.4 15C19.2662 15.9248 18.9887 16.8191 18.5789 17.6474C18.1692 18.4758 17.6335 19.2262 16.995 19.8666C16.3565 20.507 15.6248 21.0281 14.8315 21.4079C14.0382 21.7878 13.1949 22.0212 12.3333 22.0993C11.4718 22.1774 10.6045 22.099 9.76823 21.8675C8.93198 21.636 8.13932 21.255 7.425 20.7407C6.71068 20.2264 6.08551 19.5865 5.57667 18.8495C5.06783 18.1124 4.68325 17.2894 4.44033 16.4177C4.19741 15.5459 4.09973 14.6388 4.15133 13.7347C4.20294 12.8305 4.40287 11.943 4.74267 11.1127C5.08247 10.2823 5.55696 9.52175 6.14467 8.86667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Fill Demo Credentials
            </button>
          </div>
        </form>

        {/* Registration Link */}
        <div className="register-link-container">
          <p className="register-link-text">
            Don't have an account?{" "}
            <Link to="/register/role" className="register-link">
              Create account
            </Link>
          </p>
          <div className="login-footer">
            <p>By signing in, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}