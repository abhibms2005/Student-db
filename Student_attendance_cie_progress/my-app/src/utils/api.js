import store from "./storage";

function getStore() {
  return store.read();
}

function saveStore(s) {
  store.write(s);
}


export const api = {
  // -------------------------
  // AUTHENTICATION
  // -------------------------
  async login(email, password, role = null) {
    try {
      const result = store.authenticateUser(email, password, role);

      if (!result.success) {
        throw new Error(result.message || "Invalid credentials");
      }

      // Add dashboard data to user object
      const userWithDashboard = {
        ...result.user,
        dashboard: result.dashboard
      };

      return {
        user: userWithDashboard,
        dashboard: result.dashboard
      };
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  // -------------------------
  // DASHBOARD
  // -------------------------
  async getDashboard(userId, role) {
    try {
      const s = getStore();
      const user = s.users.find(u => u.id === userId);

      if (!user) throw new Error("User not found");

      const dashboard = store.generateDashboard(s, user);
      return dashboard;
    } catch (error) {
      console.error("Error getting dashboard:", error);
      return null;
    }
  },

  // -------------------------
  // USER MANAGEMENT
  // -------------------------
  async getCurrentUser() {
    const userData = sessionStorage.getItem("spams_user");
    return userData ? JSON.parse(userData) : null;
  },

  async updateUserProfile(userId, updates) {
    const s = getStore();
    const userIndex = s.users.findIndex(u => u.id === userId);

    if (userIndex === -1) throw new Error("User not found");

    s.users[userIndex] = { ...s.users[userIndex], ...updates };
    saveStore(s);

    return s.users[userIndex];
  },

  // -------------------------
  // SUBJECT MANAGEMENT
  // -------------------------
  async listSubjects(facultyId = null) {
    const s = getStore();
    let subjects = s.subjects || [];

    if (facultyId) {
      subjects = subjects.filter(sub => sub.facultyId === facultyId);
    }

    return subjects;
  },

  async getSubjectById(subjectId) {
    const s = getStore();
    return s.subjects.find(sub => sub.id === subjectId) || null;
  },

  // -------------------------
  // STUDENT MANAGEMENT
  // -------------------------
  async listStudents(filterId = null, role = null) {
    const s = getStore();

    if (role === "faculty") {
      const subjects = s.subjects.filter(
        (sub) => sub.facultyId === filterId
      );

      const subjectIds = subjects.map((sub) => sub.id);

      return s.students.map((stu) => ({
        ...stu,
        cie_marks: s.cie_marks?.filter(
          (m) => m.studentId === stu.id && subjectIds.includes(m.subjectId)
        ) || [],
        attendance: s.attendance?.filter((a) => a.studentId === stu.id) || [],
        leaves: s.leaves?.filter((l) => l.studentId === stu.id) || [],
      }));
    }

    if (role === "proctor") {
      const proctorStudents = s.students.filter(
        (stu) => stu.proctorId === filterId
      );

      return proctorStudents.map((stu) => ({
        ...stu,
        cie_marks: s.cie_marks?.filter((m) => m.studentId === stu.id) || [],
        attendance: s.attendance?.filter((a) => a.studentId === stu.id) || [],
        leaves: s.leaves?.filter((l) => l.studentId === stu.id) || [],
      }));
    }

    return s.students || [];
  },

  async getStudentById(studentId) {
    const s = getStore();
    const student = s.students.find(s => s.id === studentId);

    if (!student) return null;

    return {
      ...student,
      cie_marks: s.cie_marks?.filter(m => m.studentId === studentId) || [],
      attendance: s.attendance?.filter(a => a.studentId === studentId) || [],
      leaves: s.leaves?.filter(l => l.studentId === studentId) || [],
      certificates: s.certificates?.filter(c => c.studentId === studentId) || []
    };
  },

  // -------------------------
  // CIE MARKS
  // -------------------------
  async getStudentData(studentId) {
    const s = getStore();
    return {
      cie_marks: s.cie_marks?.filter((m) => m.studentId === studentId) || [],
      attendance: s.attendance?.filter((a) => a.studentId === studentId) || [],
      leaves: s.leaves?.filter((l) => l.studentId === studentId) || [],
    };
  },

  async addCieMark(entry) {
    const s = getStore();

    if (!s.cie_marks) s.cie_marks = [];

    // Generate unique ID for the mark
    const markId = `cie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const markEntry = { id: markId, ...entry };

    s.cie_marks.push(markEntry);
    saveStore(s);

    return markEntry;
  },

  async updateCieMark(markId, updates) {
    const s = getStore();
    const markIndex = s.cie_marks.findIndex(m => m.id === markId);

    if (markIndex === -1) throw new Error("Mark not found");

    s.cie_marks[markIndex] = { ...s.cie_marks[markIndex], ...updates };
    saveStore(s);

    return s.cie_marks[markIndex];
  },

  // -------------------------
  // ATTENDANCE
  // -------------------------
  async listAttendance(studentId = null) {
    const s = getStore();
    if (!s.attendance) s.attendance = [];

    if (studentId) {
      return s.attendance?.filter(a => a.studentId === studentId) || [];
    }

    return s.attendance || [];
  },

  async addAttendance(entry) {
    const s = getStore();
    if (!s.attendance) s.attendance = [];

    // Generate unique ID
    const attendanceId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const attendanceEntry = { id: attendanceId, ...entry };

    s.attendance.push(attendanceEntry);
    saveStore(s);

    return attendanceEntry;
  },

  // -------------------------
  // REASONS & FEEDBACK
  // -------------------------
  async listReasons(facultyId = null) {
    const s = getStore();
    if (!s.reasons) s.reasons = [];

    let reasons = s.reasons;

    if (facultyId) {
      // Get subjects taught by this faculty
      const facultySubjects = s.subjects.filter(sub => sub.facultyId === facultyId);
      const subjectIds = facultySubjects.map(sub => sub.id);

      // Filter reasons by subject
      reasons = reasons.filter(reason => subjectIds.includes(reason.subjectId));
    }

    return reasons;
  },

  async addReason(reason) {
    const s = getStore();

    if (!s.reasons) s.reasons = [];

    s.reasons.push(reason);
    saveStore(s);

    return reason;
  },

  async updateReasonFeedback(reasonId, facultyReply) {
    const s = getStore();
    const reasonIndex = s.reasons.findIndex(r => r.id === reasonId);

    if (reasonIndex === -1) throw new Error("Reason not found");

    s.reasons[reasonIndex] = {
      ...s.reasons[reasonIndex],
      facultyReply,
      repliedAt: new Date().toISOString()
    };

    saveStore(s);

    return s.reasons[reasonIndex];
  },

  // -------------------------
  // CERTIFICATES
  // -------------------------
  async listCertificates(studentId = null, facultyId = null) {
    const s = getStore();
    if (!s.certificates) s.certificates = [];

    let certificates = s.certificates;

    if (studentId) {
      certificates = certificates.filter(c => c.studentId === studentId);
    }

    if (facultyId) {
      certificates = certificates.filter(c => c.facultyId === facultyId);
    }

    return certificates;
  },

  async addCertificate(certificate) {
    const s = getStore();

    if (!s.certificates) s.certificates = [];

    // Generate unique ID
    const certId = `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const certEntry = { id: certId, ...certificate };

    s.certificates.push(certEntry);
    saveStore(s);

    return certEntry;
  },

  async updateCertificate(certificateId, updates) {
    const s = getStore();
    const certIndex = s.certificates.findIndex(c => c.id === certificateId);

    if (certIndex === -1) throw new Error("Certificate not found");

    s.certificates[certIndex] = { ...s.certificates[certIndex], ...updates };
    saveStore(s);

    return s.certificates[certIndex];
  },

  // -------------------------
  // LEAVES
  // -------------------------
  async listLeaves(studentId = null, proctorId = null) {
    const s = getStore();
    if (!s.leaves) s.leaves = [];

    let leaves = s.leaves;

    if (studentId) {
      leaves = leaves.filter(l => l.studentId === studentId);
    }

    if (proctorId) {
      // Get students under this proctor
      const proctorStudents = s.students.filter(s => s.proctorId === proctorId);
      const studentIds = proctorStudents.map(s => s.id);

      leaves = leaves.filter(l => studentIds.includes(l.studentId));
    }

    return leaves;
  },

  async addLeave(leave) {
    const s = getStore();

    if (!s.leaves) s.leaves = [];

    // Generate unique ID
    const leaveId = `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const leaveEntry = { id: leaveId, ...leave, status: 'pending' };

    s.leaves.push(leaveEntry);
    saveStore(s);

    return leaveEntry;
  },

  async updateLeaveStatus(leaveId, status, remarks = null) {
    const s = getStore();
    const leaveIndex = s.leaves.findIndex(l => l.id === leaveId);

    if (leaveIndex === -1) throw new Error("Leave not found");

    s.leaves[leaveIndex] = {
      ...s.leaves[leaveIndex],
      status,
      remarks,
      reviewedAt: new Date().toISOString()
    };

    saveStore(s);

    return s.leaves[leaveIndex];
  },

  // -------------------------
  // MESSAGES
  // -------------------------
  async listMessages(userId, role) {
    const s = getStore();
    if (!s.messages) s.messages = [];

    // Get messages where user is sender or receiver
    return s.messages.filter(msg =>
      msg.senderId === userId ||
      msg.receiverId === userId ||
      (role === 'faculty' && msg.receiverRole === 'faculty') ||
      (role === 'proctor' && msg.receiverRole === 'proctor')
    );
  },

  async sendMessage(message) {
    const s = getStore();

    if (!s.messages) s.messages = [];

    // Generate unique ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageEntry = {
      id: messageId,
      ...message,
      timestamp: new Date().toISOString(),
      read: false
    };

    s.messages.push(messageEntry);
    saveStore(s);

    return messageEntry;
  },

  // -------------------------
  // REPORTS
  // -------------------------
  async generateReport(type, filters = {}) {
    const s = getStore();

    switch (type) {
      case 'student_performance':
        return this.generateStudentPerformanceReport(s, filters);
      case 'attendance_summary':
        return this.generateAttendanceReport(s, filters);
      case 'cie_summary':
        return this.generateCIEReport(s, filters);
      default:
        throw new Error("Invalid report type");
    }
  },

  generateStudentPerformanceReport(s, filters) {
    // Implement report generation logic
    return {
      type: 'student_performance',
      generatedAt: new Date().toISOString(),
      data: [] // Add actual data
    };
  },

  generateAttendanceReport(s, filters) {
    // Implement report generation logic
    return {
      type: 'attendance_summary',
      generatedAt: new Date().toISOString(),
      data: [] // Add actual data
    };
  },

  generateCIEReport(s, filters) {
    // Implement report generation logic
    return {
      type: 'cie_summary',
      generatedAt: new Date().toISOString(),
      data: [] // Add actual data
    };
  }
};