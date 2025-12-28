import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FacultyRegister.css";
// If you have an image file, import it here. Otherwise, we'll use an icon.
import facultyIcon from "./faculty-icon.png"; // You can add this image or use SVG

export default function FacultyRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isProctor: false,
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate("/register/role"); // Navigate back to role selection
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Full name is required";
    else if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Include at least one uppercase letter and one number";
    }
    
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors below" });
      return;
    }
    
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    
    // Simulate API call
    setTimeout(() => {
      // Build faculty account data
      const facultyAccount = {
        role: "faculty",
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };

      console.log("Creating Faculty Account:", facultyAccount);

      // If user is also a proctor, create a separate proctor account
      if (form.isProctor) {
        const proctorAccount = {
          role: "proctor",
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        };
        console.log("Creating Proctor Account:", proctorAccount);
        
        setMessage({
          type: "success",
          text: "✅ Success! Two accounts have been created. During login, select your desired role."
        });
      } else {
        setMessage({
          type: "success",
          text: "✅ Faculty account created successfully!"
        });
      }
      
      setIsLoading(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          isProctor: false,
        });
        setErrors({});
        setMessage({ type: "", text: "" });
      }, 3000);
      
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="faculty-register-container">
      <div className="faculty-register-card">
        {/* Back Button */}
        <button className="back-button" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {/* Header with Circle Icon */}
        <div className="faculty-register-header">
          <div className="faculty-register-logo-circle">
            {/* Option 1: Using an image file */}
            {/* <img src={facultyIcon} alt="Faculty" className="faculty-logo-img" /> */}
            
            {/* Option 2: Using an SVG icon (if no image file) */}
            <div className="faculty-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14L21 9L12 4L3 9L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14L18.159 10.578C18.6986 10.2569 19.302 10.0577 19.926 9.994C20.55 9.9303 21.1806 10.0036 21.775 10.209C22.3694 10.4144 22.9138 10.7472 23.372 11.184C23.8302 11.6208 24.1916 12.1518 24.433 12.74C24.6743 13.3282 24.7898 13.9598 24.772 14.594C24.7542 15.2282 24.6035 15.8511 24.33 16.422C24.0564 16.9929 23.6663 17.4987 23.185 17.905C22.7037 18.3113 22.1424 18.609 21.54 18.779L12 22L2.46 18.779C1.85763 18.609 1.29627 18.3113 0.815 17.905C0.333733 17.4987 -0.0564319 16.9929 -0.33 16.422C-0.603568 15.8511 -0.754248 15.2282 -0.772 14.594C-0.789752 13.9598 -0.674259 13.3282 -0.433 12.74C-0.191741 12.1518 0.169566 11.6208 0.6278 11.184C1.08603 10.7472 1.6306 10.4144 2.225 10.209C2.8194 10.0036 3.45 9.9303 4.074 9.994C4.698 10.0577 5.30141 10.2569 5.841 10.578L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="faculty-register-title">Faculty Registration</h1>
          <p className="faculty-register-subtitle">Join our academic community</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`faculty-register-message faculty-register-message-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="faculty-register-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'form-input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your institutional email"
              value={form.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number (optional)"
              value={form.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'form-input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
            <div className="password-hints">
              <span className={`hint ${form.password.length >= 8 ? 'hint-valid' : ''}`}>
                • At least 8 characters
              </span>
              <span className={`hint ${/[A-Z]/.test(form.password) ? 'hint-valid' : ''}`}>
                • One uppercase letter
              </span>
              <span className={`hint ${/\d/.test(form.password) ? 'hint-valid' : ''}`}>
                • One number
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            {form.confirmPassword && form.password === form.confirmPassword && (
              <span className="form-success">✓ Passwords match</span>
            )}
          </div>

          {/* Proctor Option */}
          <div className="proctor-option">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="isProctor"
                name="isProctor"
                checked={form.isProctor}
                onChange={handleChange}
                disabled={isLoading}
                className="proctor-checkbox"
              />
              <label htmlFor="isProctor" className="proctor-label">
                <div className="proctor-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2.905 20.249C3.827 19.345 4.939 18.622 6.173 18.132C7.408 17.643 8.738 17.397 10.08 17.409C11.423 17.421 12.748 17.691 14.073 18.132C15.397 18.573 16.588 19.296 17.572 20.249" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 8L16 12L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="proctor-text">
                  <span className="proctor-title">Also register as Proctor</span>
                  <span className="proctor-description">
                    This will create a separate proctor account for exam supervision duties
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'submit-btn-loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Register as Faculty'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="login-link-container">
          <p className="login-link-text">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign in here
            </Link>
          </p>
          <p className="role-note">
            <strong>Note:</strong> During login, select your role (Faculty or Proctor)
          </p>
        </div>
      </div>
    </div>
  );
}