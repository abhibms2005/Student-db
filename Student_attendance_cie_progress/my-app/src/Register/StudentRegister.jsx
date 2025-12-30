import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentRegister.css";
import storage from "../utils/storage";

// Mock data - In real app, this would come from backend/context
const PROCTORS = [
  { id: "p1", name: "Dr. Raj Kumar", email: "raj@uni.edu", role: "proctor", department: "Computer Science" },
  { id: "p2", name: "Dr. Meena Sharma", email: "meena@uni.edu", role: "proctor", department: "Information Technology" },
  { id: "p3", name: "Prof. Anil Patel", email: "anil@uni.edu", role: "faculty", department: "Electronics" }, // Not a proctor
  { id: "p4", name: "Dr. Priya Singh", email: "priya@uni.edu", role: "proctor", department: "Computer Science" },
  { id: "p5", name: "Prof. Robert Johnson", email: "robert@uni.edu", role: "faculty", department: "Software Engineering" } // Not a proctor
];

// Subjects by semester (1-8)
const SUBJECTS_BY_SEMESTER = {
  1: [
    { code: "MAT101", name: "Engineering Mathematics I", credits: 4 },
    { code: "PHY101", name: "Engineering Physics", credits: 3 },
    { code: "CSE101", name: "Programming Fundamentals", credits: 4 },
    { code: "EEE101", name: "Basic Electrical Engineering", credits: 3 },
    { code: "ENG101", name: "Technical Communication", credits: 2 }
  ],
  2: [
    { code: "MAT102", name: "Engineering Mathematics II", credits: 4 },
    { code: "CHE101", name: "Engineering Chemistry", credits: 3 },
    { code: "CSE102", name: "Data Structures", credits: 4 },
    { code: "MEC101", name: "Engineering Mechanics", credits: 3 },
    { code: "EEE102", name: "Digital Electronics", credits: 3 }
  ],
  3: [
    { code: "CSE201", name: "Object Oriented Programming", credits: 4 },
    { code: "CSE202", name: "Discrete Mathematics", credits: 3 },
    { code: "CSE203", name: "Computer Organization", credits: 3 },
    { code: "MAT201", name: "Probability & Statistics", credits: 3 },
    { code: "HUM201", name: "Environmental Studies", credits: 2 }
  ],
  4: [
    { code: "CSE204", name: "Database Management Systems", credits: 4 },
    { code: "CSE205", name: "Operating Systems", credits: 4 },
    { code: "CSE206", name: "Theory of Computation", credits: 3 },
    { code: "CSE207", name: "Software Engineering", credits: 3 },
    { code: "ECE201", name: "Microprocessors", credits: 3 }
  ],
  5: [
    { code: "CSE301", name: "Computer Networks", credits: 4 },
    { code: "CSE302", name: "Design & Analysis of Algorithms", credits: 4 },
    { code: "CSE303", name: "Web Technologies", credits: 3 },
    { code: "CSE304", name: "Artificial Intelligence", credits: 4 },
    { code: "CSE305", name: "Computer Graphics", credits: 3 }
  ],
  6: [
    { code: "CSE306", name: "Compiler Design", credits: 4 },
    { code: "CSE307", name: "Machine Learning", credits: 4 },
    { code: "CSE308", name: "Mobile Application Development", credits: 3 },
    { code: "CSE309", name: "Cloud Computing", credits: 3 },
    { code: "CSE310", name: "Information Security", credits: 3 }
  ],
  7: [
    { code: "CSE401", name: "Data Science", credits: 4 },
    { code: "CSE402", name: "Internet of Things", credits: 3 },
    { code: "CSE403", name: "Big Data Analytics", credits: 4 },
    { code: "CSE404", name: "Blockchain Technology", credits: 3 },
    { code: "CSE405", name: "Cyber Security", credits: 4 }
  ],
  8: [
    { code: "CSE406", name: "Natural Language Processing", credits: 4 },
    { code: "CSE407", name: "Computer Vision", credits: 4 },
    { code: "CSE408", name: "Robotics", credits: 3 },
    { code: "CSE409", name: "Quantum Computing", credits: 3 },
    { code: "CSE410", name: "Project Management", credits: 2 }
  ]
};

// Study Years
const STUDY_YEARS = [
  { value: "1", label: "First Year" },
  { value: "2", label: "Second Year" },
  { value: "3", label: "Third Year" },
  { value: "4", label: "Fourth Year" }
];

// Departments
const DEPARTMENTS = [
  { value: "cse", label: "Computer Science & Engineering" },
  { value: "it", label: "Information Technology" },
  { value: "ece", label: "Electronics & Communication" },
  { value: "eee", label: "Electrical & Electronics" },
  { value: "mech", label: "Mechanical Engineering" },
  { value: "civil", label: "Civil Engineering" }
];

export default function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    phone: "",
    studyYear: "",
    semester: "",
    proctorId: "",
    subjects: [],
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [availableProctors, setAvailableProctors] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Filter to show only proctors (role = "proctor")
  useEffect(() => {
    const proctorsOnly = PROCTORS.filter(p => p.role === "proctor");
    setAvailableProctors(proctorsOnly);
  }, []);

  // Update subjects when semester changes
  useEffect(() => {
    if (form.semester) {
      const subjects = SUBJECTS_BY_SEMESTER[parseInt(form.semester)] || [];
      setCurrentSubjects(subjects);

      // Automatically select all subjects for the semester
      setForm(prev => ({
        ...prev,
        subjects: subjects
      }));
    } else {
      setCurrentSubjects([]);
      setForm(prev => ({
        ...prev,
        subjects: []
      }));
    }
  }, [form.semester]);

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Reset form
    setForm({
      name: "",
      email: "",
      rollNumber: "",
      department: "",
      phone: "",
      studyYear: "",
      semester: "",
      proctorId: "",
      subjects: [],
      password: "",
      confirmPassword: ""
    });
    setErrors({});
    setMessage({ type: "", text: "" });
    setCurrentSubjects([]);
    // Navigate to login
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/register/role");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    else if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.rollNumber) newErrors.rollNumber = "Roll number is required";

    if (!form.department) newErrors.department = "Department is required";

    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!form.studyYear) newErrors.studyYear = "Study year is required";

    if (!form.semester) newErrors.semester = "Semester is required";

    if (!form.proctorId) newErrors.proctorId = "Please select a proctor";

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

    // Save to storage
    try {
      const st = storage.read();

      // Check if email already exists
      const emailExists = st.users.find(u => u.email === form.email);
      if (emailExists) {
        setMessage({ type: "error", text: "This email is already registered. Please use a different email." });
        setIsLoading(false);
        return;
      }

      // Generate new student ID
      const newStudentId = "s" + (st.students.length + 1);

      // Create user account
      const newUser = {
        id: newStudentId,
        role: "student",
        name: form.name,
        email: form.email,
        password: form.password,
        roll: form.rollNumber,
        proctorId: form.proctorId
      };

      // Create student record
      const newStudent = {
        id: newStudentId,
        role: "student",
        name: form.name,
        roll: form.rollNumber,
        email: form.email,
        phone: form.phone,
        department: form.department,
        studyYear: form.studyYear,
        semester: form.semester,
        proctorId: form.proctorId,
        activityPoints: 0,
        registrationDate: new Date().toISOString(),
        status: "active",
        totalCredits: form.subjects.reduce((sum, subject) => sum + subject.credits, 0),
        subjects: form.subjects
      };

      // Add to storage
      st.users.push(newUser);
      st.students.push(newStudent);

      const success = storage.write(st);

      if (!success) {
        throw new Error("Failed to save data to storage");
      }

      // Verify write
      const verifySt = storage.read();
      const userExists = verifySt.users.find(u => u.email === form.email);

      if (!userExists) {
        throw new Error("Storage write verification failed");
      }

      console.log("Student Registration Successful & Verified:", newStudent);

      setIsLoading(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Registration error:", error);
      setMessage({ type: "error", text: "Registration failed: " + error.message });
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleSubject = (subject) => {
    setForm((prev) => {
      const exists = prev.subjects.find(s => s.code === subject.code);
      if (exists) {
        return {
          ...prev,
          subjects: prev.subjects.filter(s => s.code !== subject.code)
        };
      } else {
        return {
          ...prev,
          subjects: [...prev.subjects, subject]
        };
      }
    });
  };

  const isSubjectSelected = (subjectCode) => {
    return form.subjects.some(s => s.code === subjectCode);
  };

  return (
    <div className="student-register-container">
      <div className="student-register-card">
        {/* Back Button */}
        <button className="back-button" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        {/* Header with Circle Icon */}
        <div className="student-register-header">
          <div className="student-register-logo-circle">
            <div className="student-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14L21 9L12 4L3 9L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14L18.159 10.578C18.6986 10.2569 19.302 10.0577 19.926 9.994C20.55 9.9303 21.1806 10.0036 21.775 10.209C22.3694 10.4144 22.9138 10.7472 23.372 11.184C23.8302 11.6208 24.1916 12.1518 24.433 12.74C24.6743 13.3282 24.7898 13.9598 24.772 14.594C24.7542 15.2282 24.6035 15.8511 24.33 16.422C24.0564 16.9929 23.6663 17.4987 23.185 17.905C22.7037 18.3113 22.1424 18.609 21.54 18.779L12 22L2.46 18.779C1.85763 18.609 1.29627 18.3113 0.815 17.905C0.333733 17.4987 -0.0564319 16.9929 -0.33 16.422C-0.603568 15.8511 -0.754248 15.2282 -0.772 14.594C-0.789752 13.9598 -0.674259 13.3282 -0.433 12.74C-0.191741 12.1518 0.169566 11.6208 0.6278 11.184C1.08603 10.7472 1.6306 10.4144 2.225 10.209C2.8194 10.0036 3.45 9.9303 4.074 9.994C4.698 10.0577 5.30141 10.2569 5.841 10.578L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 11L11 13L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h1 className="student-register-title">Student Registration</h1>
          <p className="student-register-subtitle">Join our academic community</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`student-register-message student-register-message-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="student-register-form">
          <div className="form-row">
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
              <label htmlFor="rollNumber" className="form-label">
                Roll Number *
              </label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                placeholder="Enter your roll number"
                value={form.rollNumber}
                onChange={handleChange}
                className={`form-input ${errors.rollNumber ? 'form-input-error' : ''}`}
                disabled={isLoading}
              />
              {errors.rollNumber && <span className="form-error">{errors.rollNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
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
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                disabled={isLoading}
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className={`form-input ${errors.department ? 'form-input-error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
              {errors.department && <span className="form-error">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="studyYear" className="form-label">
                Study Year *
              </label>
              <select
                id="studyYear"
                name="studyYear"
                value={form.studyYear}
                onChange={handleChange}
                className={`form-input ${errors.studyYear ? 'form-input-error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select Study Year</option>
                {STUDY_YEARS.map(year => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
              {errors.studyYear && <span className="form-error">{errors.studyYear}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="semester" className="form-label">
                Semester *
              </label>
              <select
                id="semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className={`form-input ${errors.semester ? 'form-input-error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
              {errors.semester && <span className="form-error">{errors.semester}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="proctorId" className="form-label">
                Select Proctor *
              </label>
              <select
                id="proctorId"
                name="proctorId"
                value={form.proctorId}
                onChange={handleChange}
                className={`form-input ${errors.proctorId ? 'form-input-error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select a Proctor</option>
                {availableProctors.map(proctor => (
                  <option key={proctor.id} value={proctor.id}>
                    {proctor.name} - {proctor.department}
                  </option>
                ))}
              </select>
              {errors.proctorId && <span className="form-error">{errors.proctorId}</span>}
            </div>
          </div>

          <div className="form-row">
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
          </div>

          {/* Subjects Section */}
          {form.semester && currentSubjects.length > 0 && (
            <div className="subjects-section">
              <div className="subjects-header">
                <h3 className="subjects-title">Subjects for Semester {form.semester}</h3>
                <div className="subjects-summary">
                  <span className="summary-item">
                    <span className="summary-label">Total Subjects:</span>
                    <span className="summary-value">{currentSubjects.length}</span>
                  </span>
                  <span className="summary-item">
                    <span className="summary-label">Selected:</span>
                    <span className="summary-value">{form.subjects.length}</span>
                  </span>
                  <span className="summary-item">
                    <span className="summary-label">Total Credits:</span>
                    <span className="summary-value">
                      {form.subjects.reduce((sum, subject) => sum + subject.credits, 0)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="subjects-grid">
                {currentSubjects.map(subject => {
                  const isSelected = isSubjectSelected(subject.code);
                  return (
                    <div
                      key={subject.code}
                      className={`subject-card ${isSelected ? 'subject-card-selected' : ''}`}
                      onClick={() => !isLoading && toggleSubject(subject)}
                    >
                      <div className="subject-checkbox">
                        <div className={`checkbox-indicator ${isSelected ? 'checkbox-indicator-checked' : ''}`}>
                          {isSelected && (
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="subject-info">
                        <div className="subject-code">{subject.code}</div>
                        <div className="subject-name">{subject.name}</div>
                        <div className="subject-credits">{subject.credits} Credits</div>
                      </div>
                      <div className="subject-status">
                        {isSelected ? (
                          <span className="status-selected">✓ Selected</span>
                        ) : (
                          <span className="status-available">Click to select</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="subjects-note">
                <div className="note-icon">ℹ️</div>
                <p>
                  All subjects for Semester {form.semester} are selected by default.
                  You can deselect any subject by clicking on it.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'submit-btn-loading' : ''}`}
            disabled={isLoading || !form.semester}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Registering Student...
              </>
            ) : (
              'Register Student'
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
            <strong>Note:</strong> All proctors listed are registered as proctors only
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={handleSuccessModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon success-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="modal-title">Registration Successful!</h2>
            <p className="modal-message">
              Your student account has been created successfully. You can now login with your credentials.
            </p>
            <div className="modal-details">
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>Roll Number:</strong> {form.rollNumber}</p>
            </div>
            <button
              className="modal-button"
              onClick={handleSuccessModalClose}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
