// utils/storage.js

const KEY = "spams_v5_store";

const seed = {
  users: [
    {
      id: "s1",
      role: "student",
      name: "Alice",
      email: "alice@example.com",
      password: "pass",
      roll: "CS101",
      proctorId: "p1"
    },
    {
      id: "f1",
      role: "faculty",
      name: "Prof. Bob",
      email: "bob@example.com",
      password: "pass"
    },
    {
      id: "p1",
      role: "proctor",
      name: "Proctor John",
      email: "proctor@example.com",
      password: "pass"
    }
  ],

  students: [
    {
      id: "s1",
      role: "student",
      name: "Alice",
      roll: "CS101",
      email: "alice@example.com",
      proctorId: "p1",
      activityPoints: 0
    }
  ],

  faculty: [
    {
      id: "f1",
      name: "Prof. Bob",
      email: "bob@example.com"
    }
  ],

  proctors: [
    {
      id: "p1",
      name: "Proctor John",
      email: "proctor@example.com"
    }
  ],

  subjects: [
    {
      id: "sub1",
      name: "Mathematics",
      facultyId: "f1"
    },
    {
      id: "sub2",
      name: "Physics",
      facultyId: "f1"
    },
    {
      id: "sub3",
      name: "Chemistry",
      facultyId: "f1"
    }
  ],

  cie_marks: [
    {
      studentId: "s1",
      subjectId: "sub1",
      cieNo: 1,
      expected: 50,
      obtained: 28, // ~56%
      total: 50,
      date: "2025-08-01"
    },
    {
      studentId: "s1",
      subjectId: "sub1",
      cieNo: 2,
      expected: 50,
      obtained: 32, // ~64%
      total: 50,
      date: "2025-09-15"
    },
    {
      studentId: "s1",
      subjectId: "sub2",
      cieNo: 1,
      expected: 50,
      obtained: 25, // 50%
      total: 50,
      date: "2025-08-01"
    }
    ,
    {
      studentId: "s1",
      subjectId: "sub2",
      cieNo: 2,
      expected: 50,
      obtained: 22, // 44%
      total: 50,
      date: "2025-10-10"
    },
    {
      studentId: "s1",
      subjectId: "sub3",
      cieNo: 1,
      expected: 50,
      obtained: 38, // 76%
      total: 50,
      date: "2025-09-01"
    }
  ],

  attendance: [
    // Hardcoded deterministic data for stability (mocking ~50-60% attendance)
    { studentId: "s1", subjectId: "sub1", date: "2024-08-01", status: "present" },
    { studentId: "s1", subjectId: "sub1", date: "2024-08-03", status: "absent", reason: "Sick" },
    { studentId: "s1", subjectId: "sub1", date: "2024-08-06", status: "present" },
    { studentId: "s1", subjectId: "sub1", date: "2024-08-09", status: "absent" },
    { studentId: "s1", subjectId: "sub1", date: "2024-08-12", status: "present" },
    { studentId: "s1", subjectId: "sub1", date: "2024-08-15", status: "present" },
    { studentId: "s1", subjectId: "sub1", date: "2024-08-18", status: "absent" },
    { studentId: "s1", subjectId: "sub1", date: "2024-08-21", status: "present" },

    { studentId: "s1", subjectId: "sub2", date: "2024-08-01", status: "present" },
    { studentId: "s1", subjectId: "sub2", date: "2024-08-03", status: "present" },
    { studentId: "s1", subjectId: "sub2", date: "2024-08-06", status: "present" },
    { studentId: "s1", subjectId: "sub2", date: "2024-08-09", status: "absent" },
    { studentId: "s1", subjectId: "sub2", date: "2024-08-12", status: "present" },

    { studentId: "s1", subjectId: "sub3", date: "2024-08-01", status: "absent" },
    { studentId: "s1", subjectId: "sub3", date: "2024-08-03", status: "present" },
    { studentId: "s1", subjectId: "sub3", date: "2024-08-06", status: "absent" },
    { studentId: "s1", subjectId: "sub3", date: "2024-08-09", status: "absent" },
    { studentId: "s1", subjectId: "sub3", date: "2024-08-12", status: "present" }
  ],

  leaves: [],
  reasons: [],
  messages: [],

  certificates: [
    {
      id: "c1",
      studentId: "s1",
      facultyId: "f1",
      type: "Medical",
      date: "2025-12-12",
      reason: "Sick leave",
      file: "/uploads/cert1.pdf",
      forwarded: false
    }
  ],

  activityCertificates: [
    {
      id: "a1",
      studentId: "s1",
      type: "Coding Contest",
      date: "2025-12-15",
      points: 10,
      file: "/uploads/activity1.pdf",
      status: "pending",
      rejectReason: ""
    }
  ],

  dashboard: {},

  upcomingClasses: [
    {
      id: "cls1",
      title: "Calculus Lecture",
      subject: "Mathematics",
      teacher: "Prof. Bob",
      date: "2025-02-10",
      time: "10:00 AM",
      timeLeft: "2h"
    },
    {
      id: "cls2",
      title: "Physics Lab",
      subject: "Physics",
      teacher: "Prof. Bob",
      date: "2025-02-11",
      time: "2:00 PM",
      timeLeft: "5h"
    }
  ],

  assignment: {
    title: "Homework 1",
    subject: "Mathematics",
    deadline: "2025-02-15"
  },

  pendingQuizzes: [
    {
      id: "q1",
      title: "Quiz 1",
      questions: 10,
      duration: 15
    },
    {
      id: "q2",
      title: "Quiz 2",
      questions: 5,
      duration: 10
    }
  ]
};

// ---------------- Helper: Ensure data structure ----------------
function ensureDataStructure(data) {
  if (!data) return { ...seed };

  const requiredArrays = [
    'users', 'students', 'faculty', 'proctors', 'subjects', 'cie_marks', 'attendance',
    'leaves', 'reasons', 'messages', 'certificates', 'activityCertificates',
    'upcomingClasses', 'pendingQuizzes'
  ];

  requiredArrays.forEach(key => {
    if (!Array.isArray(data[key])) data[key] = seed[key] || [];
  });

  if (!data.dashboard || typeof data.dashboard !== 'object') data.dashboard = {};
  if (!data.assignment || typeof data.assignment !== 'object') data.assignment = seed.assignment || null;

  return data;
}

// ---------------- Dashboard Generator ----------------
function generateDashboard(st, user = null) {
  st = ensureDataStructure(st);

  if (!user) {
    user = st.users.find(u => u.role === "student") || st.students[0];
    if (!user) return { ...st.dashboard };
  }

  switch (user.role) {
    case "student":
      return generateStudentDashboard(st, user);
    case "faculty":
      return generateFacultyDashboard(st, user);
    case "proctor":
      return generateProctorDashboard(st, user);
    default:
      return { ...st.dashboard };
  }
}

// Student Dashboard
function generateStudentDashboard(st, user) {
  const student = st.students.find(s => s.id === user.id) || user;
  const studentId = student.id;

  const dashboardSubjects = (st.subjects || []).map(sub => {
    const cie = (st.cie_marks || []).filter(c => c.studentId === studentId && c.subjectId === sub.id);
    const totalObtained = cie.reduce((acc, m) => acc + (m.obtained || 0), 0);
    const totalExpected = cie.reduce((acc, m) => acc + (m.expected || 0), 0);
    const progress = totalExpected > 0 ? Math.round((totalObtained / totalExpected) * 100) : 0;
    const score = cie.length > 0 ? Math.round((totalObtained / totalExpected) * 100) : 0;

    return {
      id: sub.id,
      name: sub.name,
      progress,
      score
    };
  });

  const cieChart = (st.cie_marks || [])
    .filter(c => c.studentId === studentId)
    .map(c => ({
      cie: `CIE-${c.cieNo}`,
      expected: c.expected,
      obtained: c.obtained
    }));

  // Aggregate attendance by month for a better trend view
  const attendanceByMonth = {};

  (st.attendance || [])
    .filter(a => a.studentId === studentId)
    .forEach(a => {
      const date = new Date(a.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });

      if (!attendanceByMonth[monthKey]) {
        attendanceByMonth[monthKey] = { total: 0, present: 0 };
      }

      attendanceByMonth[monthKey].total++;
      if (a.status === "present") {
        attendanceByMonth[monthKey].present++;
      }
    });

  const attendanceTimeline = Object.keys(attendanceByMonth).map(month => ({
    date: month,
    val: Math.round((attendanceByMonth[month].present / attendanceByMonth[month].total) * 100)
  }));

  const totalAttendance = attendanceTimeline.length;
  const presentCount = attendanceTimeline.filter(a => a.val === 100).length;
  const attendancePercent = totalAttendance ? Math.round((presentCount / totalAttendance) * 100) : 0;

  const completedCourses = dashboardSubjects.filter(s => s.progress >= 100).length;

  return {
    user: student,
    role: "student",
    dashboardSubjects,
    cie_marks_for_chart: cieChart,
    attendanceTimeline,
    upcomingClasses: st.upcomingClasses || [],
    assignment: st.assignment || null,
    pendingQuizzes: st.pendingQuizzes || [],
    performance: {
      attendance: attendancePercent
    },
    completedCourses,
    hoursSpent: "12h"
  };
}

// Faculty Dashboard
function generateFacultyDashboard(st, user) {
  const faculty = st.faculty.find(f => f.id === user.id) || user;
  const facultySubjects = st.subjects.filter(s => s.facultyId === user.id);
  const allStudents = st.students;

  const facultyCieMarks = st.cie_marks.filter(cie =>
    facultySubjects.some(sub => sub.id === cie.subjectId)
  );

  const pendingCertificates = st.certificates.filter(c => !c.forwarded);
  const pendingReasons = st.reasons.filter(r => !r.facultyReply);

  return {
    user: faculty,
    role: "faculty",
    facultySubjects,
    totalStudents: allStudents.length,
    pendingCertificates: pendingCertificates.length,
    pendingReasons: pendingReasons.length,
    upcomingClasses: st.upcomingClasses.filter(cls => cls.teacher === faculty.name) || [],
    recentMarks: facultyCieMarks.slice(-5),
    dashboardStats: {
      totalSubjects: facultySubjects.length,
      averageAttendance: 85,
      pendingAssignments: 3,
      completedEvaluations: 12
    }
  };
}

// Proctor Dashboard
function generateProctorDashboard(st, user) {
  const proctor = st.proctors.find(p => p.id === user.id) || user;
  const proctorStudents = st.students.filter(s => s.proctorId === user.id);

  const studentAttendance = st.attendance.filter(a =>
    proctorStudents.some(s => s.id === a.studentId)
  );

  const studentCieMarks = st.cie_marks.filter(cie =>
    proctorStudents.some(s => s.id === cie.studentId)
  );

  const totalAttendanceRecords = studentAttendance.length;
  const presentRecords = studentAttendance.filter(a => a.status === "present").length;
  const attendancePercentage = totalAttendanceRecords > 0
    ? Math.round((presentRecords / totalAttendanceRecords) * 100)
    : 0;

  const pendingLeaves = st.leaves.filter(l =>
    proctorStudents.some(s => s.id === l.studentId) && !l.approved
  );

  return {
    user: proctor,
    role: "proctor",
    proctorStudents,
    totalStudents: proctorStudents.length,
    studentAttendance,
    studentCieMarks,
    pendingLeaves: pendingLeaves.length,
    attendancePercentage,
    dashboardStats: {
      averagePerformance: 75,
      atRiskStudents: proctorStudents.filter(s => {
        const studentMarks = studentCieMarks.filter(m => m.studentId === s.id);
        const avgMarks = studentMarks.length > 0
          ? studentMarks.reduce((sum, m) => sum + (m.obtained || 0), 0) / studentMarks.length
          : 0;
        return avgMarks < 60;
      }).length,
      pendingActions: pendingLeaves.length
    }
  };
}

// ---------------- Read / Write ----------------
function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const finalSeed = { ...seed };
      localStorage.setItem(KEY, JSON.stringify(finalSeed));
      return finalSeed;
    }

    const parsed = JSON.parse(raw);
    const data = ensureDataStructure(parsed);

    // Core Robustness: If critical data (subjects) is missing, force reset to seed
    if (!data.subjects || data.subjects.length === 0) {
      console.warn("Detected corrupted storage (missing subjects), resetting to seed...");
      const finalSeed = { ...seed };
      localStorage.setItem(KEY, JSON.stringify(finalSeed));
      return finalSeed;
    }

    return data;
  } catch (error) {
    console.error("Error reading from storage:", error);
    const fixed = { ...seed };
    localStorage.setItem(KEY, JSON.stringify(fixed));
    return fixed;
  }
}

function write(data) {
  try {
    const structuredData = ensureDataStructure(data);
    localStorage.setItem(KEY, JSON.stringify(structuredData));
    return true;
  } catch (error) {
    console.error("Error writing to storage:", error);
    return false;
  }
}

function clear() {
  localStorage.removeItem(KEY);
  return { ...seed };
}

// ---------------- Dev helper: reset localStorage to seed ----------------
function resetToSeed() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...seed }));
    return true;
  } catch (e) {
    console.error('Failed to reset seed:', e);
    return false;
  }
}

// ---------------- Dashboard getters ----------------
function getStudentDashboard() {
  const st = read();
  const user = st.users.find(u => u.role === "student") || st.students[0];
  if (!user) return null;

  const dashboard = generateDashboard(st, user);
  st.dashboard = dashboard;
  write(st);
  return dashboard;
}

function getFacultyDashboard(facultyId) {
  const st = read();
  const user = st.users.find(u => u.id === facultyId && u.role === "faculty");
  if (!user) return null;

  const dashboard = generateDashboard(st, user);
  st.dashboard = dashboard;
  write(st);
  return dashboard;
}

function getProctorDashboard(proctorId) {
  const st = read();
  const user = st.users.find(u => u.id === proctorId && u.role === "proctor");
  if (!user) return null;

  const dashboard = generateDashboard(st, user);
  st.dashboard = dashboard;
  write(st);
  return dashboard;
}
function addActivityCertificate(certificate) {
  const st = read();
  st.activityCertificates.push({
    ...certificate,
    id: "a" + (st.activityCertificates.length + 1),
    status: "pending",
    rejectReason: ""
  });
  write(st);
  return true;
}

function getActivityCertificates() {
  const st = read();
  return st.activityCertificates || [];
}

// ---------------- Authentication ----------------
function authenticateUser(email, password) {
  const st = read();

  // Ensure arrays exist
  st.users = ensureDataStructure(st).users;
  st.students = ensureDataStructure(st).students;
  st.faculty = ensureDataStructure(st).faculty;
  st.proctors = ensureDataStructure(st).proctors;

  // Find the user in users array
  const user = st.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password"
    };
  }

  // Generate dashboard for this user
  const dashboard = generateDashboard(st, user);

  // Return full user object (all properties preserved)
  const fullUser = st.users.find(u => u.id === user.id);

  return {
    success: true,
    user: { ...fullUser },
    dashboard
  };
}

export default {
  read,
  write,
  generateDashboard,
  clear,
  getStudentDashboard,
  getFacultyDashboard,
  getProctorDashboard,
  authenticateUser,
  addActivityCertificate,      // ✅ added
  getActivityCertificates,
  resetToSeed,
  KEY
};