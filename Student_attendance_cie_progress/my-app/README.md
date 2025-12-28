🎓 Student Performance & Attendance Management System

A role-based web application built using React.js to manage students, faculty, and proctors in an academic environment. The system ensures secure access, clear role separation, and real-world academic workflows.

📌 Project Overview

This project is designed to simplify and digitize academic management by providing:

Student performance tracking

Attendance management

Certificate handling

Role-based dashboards

A key design principle of the system is that proctors are faculty members, and during registration, faculty may be assigned proctor responsibilities.

👥 User Roles
1️⃣ Student

Registers as a student

Views attendance status

Tracks academic progress

Views reports

Uploads and views activity certificates

2️⃣ Faculty

Views student academic progress

Generates and views reports

Reviews certificates

Monitors student performance

3️⃣ Proctor (Faculty with Additional Responsibility)

Proctor is not a separate person

Only faculty members can become proctors

Manages student attendance

Approves or rejects attendance with a reason

Verifies student certificates

📝 Registration Logic (Important Feature)
Faculty Registration Behavior

During faculty registration, the system checks whether the faculty member is also a proctor.

Selection	Accounts Created
Faculty only	1 Faculty account
Faculty + Proctor	2 linked accounts (Faculty + Proctor)

This approach ensures:

Clean role-based permissions

Secure access control

Accurate representation of real-world academic roles

🔐 Authentication & Authorization

Role-based authentication using Context API

Secure protected routes

Users can access only their assigned role dashboards

Manual URL access to other roles is restricted

🧭 Application Flow

Application loads with Registration page

User selects role:

Student

Faculty

Faculty may optionally select Proctor responsibility

Login is available only if the user already has an account

After login, user is redirected to their role-specific dashboard

📊 Key Features

Role-based dashboards

Secure routing using React Router

Attendance approval/rejection with reason

Academic progress tracking

Certificate upload and verification

Clean and modular component structure

🛠️ Technologies Used

Frontend: React.js

Routing: React Router DOM

State Management: React Context API

Styling: CSS / Inline styles

Authentication: Custom Auth Context

🗂️ Project Structure (Simplified)
src/
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
├── pages/
│   ├── Student/
│   ├── faculty/
│   ├── proctor/
│   ├── Login.jsx
├── Register/
│   ├── RegisterRoleSelect.jsx
│   ├── StudentRegister.jsx
│   ├── FacultyRegister.jsx
├── utils/
│   ├── auth.js
│   ├── api.js
│   ├── storage.js
├── App.js

🚀 How to Run the Project

Clone the repository:

git clone <repository-url>


Install dependencies:

npm install


Start the development server:

npm start


Open in browser:

http://localhost:3000

🌟 Highlights of the Project

Real-world academic role modeling

Faculty–Proctor dual account architecture

Secure role-based access control

Scalable and modular design

Beginner-friendly React implementation

🔮 Future Enhancements

Backend integration (Node.js & Express)

Database support (MongoDB / MySQL)

Admin role

Email notifications

PDF report generation

Real-time attendance tracking

📚 Conclusion

This project demonstrates a complete role-based academic management system with a strong focus on security, scalability, and real-world applicability. The faculty–proctor design is a key architectural decision that ensures clarity and clean access control.