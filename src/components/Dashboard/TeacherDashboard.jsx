import React from "react";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const teacherName = "Professor Smith"; // You can replace with dynamic data later

  return (
    <div className="teacher-dashboard">
      {/* Header */}
      <header className="td-header">
        <div className="td-logo">PlagiX</div>
        <div className="td-greeting">Welcome, {teacherName}</div>
      </header>

      {/* Main Content */}
      <main className="td-main">
        <div className="td-cards">
          <div className="td-card">
            <h3>Check Student Reports</h3>
            <p>View submitted assignments and detect plagiarism & AI-generated content.</p>
            <button>Go to Reports</button>
          </div>
          <div className="td-card">
            <h3>Manage Classes</h3>
            <p>Create classes, add students, and assign projects.</p>
            <button>Manage Classes</button>
          </div>
          <div className="td-card">
            <h3>Feedback & Grades</h3>
            <p>Provide feedback, grades, and suggestions to students.</p>
            <button>Give Feedback</button>
          </div>
        </div>

        <div className="td-stats">
          <div className="td-stat">
            <h4>Total Students</h4>
            <p>120</p>
          </div>
          <div className="td-stat">
            <h4>Reports Checked</h4>
            <p>350</p>
          </div>
          <div className="td-stat">
            <h4>AI Detections</h4>
            <p>45</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="td-footer">
        &copy; 2025 PlagiX | All Rights Reserved
      </footer>
    </div>
  );
};

export default TeacherDashboard;
