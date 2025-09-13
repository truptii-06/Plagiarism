import React, { useState } from "react";
import "./TeacherDashboard.css";
import logo from "../../assets/logo1.png";

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState("submissions");

  // Sample data
  const [submissions, setSubmissions] = useState([
    { id: 1, student: "Aryan Patel", file: "Project_Report.pdf", status: "Reviewed", date: "13 Sept 2025" },
    { id: 2, student: "Neha Sharma", file: "AI_Code.zip", status: "Pending", date: "12 Sept 2025" },
    { id: 3, student: "Rahul Verma", file: "MiniProject.docx", status: "Reviewed", date: "11 Sept 2025" },
  ]);

  const [reports, setReports] = useState([
    { id: 1, student: "Aryan Patel", plagiarism: 10, grade: "A+" },
    { id: 2, student: "Neha Sharma", plagiarism: 55, grade: "C" },
    { id: 3, student: "Rahul Verma", plagiarism: 5, grade: "A" },
  ]);

  const markReviewed = (id) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Reviewed" } : s));
  };

  const downloadFile = (file) => {
    alert(`Downloading ${file}`);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="sidebar-menu">
          <li className={activeSection === "submissions" ? "active" : ""} onClick={() => setActiveSection("submissions")}>Submissions</li>
          <li className={activeSection === "reports" ? "active" : ""} onClick={() => setActiveSection("reports")}>Reports</li>
          <li className={activeSection === "analytics" ? "active" : ""} onClick={() => setActiveSection("analytics")}>Analytics</li>
          <li className={activeSection === "profile" ? "active" : ""} onClick={() => setActiveSection("profile")}>Profile</li>
          <li className={activeSection === "help" ? "active" : ""} onClick={() => setActiveSection("help")}>Help</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="welcome-section">
          <h1>Welcome back, Teacher 👩‍🏫</h1>
          <p>Here’s what’s happening with your students today.</p>
        </header>

        {/* Submissions Section */}
        {activeSection === "submissions" && (
          <section className="section">
            <h2>Recent Student Submissions</h2>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>File</th>
                  <th>Status</th>
                  <th>Submitted On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.student}</td>
                    <td>{sub.file}</td>
                    <td>{sub.status === "Pending" ? "Pending ⏳" : "Reviewed ✅"}</td>
                    <td>{sub.date}</td>
                    <td>
                      {sub.status === "Pending" && <button onClick={() => markReviewed(sub.id)}>Mark Reviewed</button>}
                      <button onClick={() => downloadFile(sub.file)}>Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Reports Section */}
        {activeSection === "reports" && (
          <section className="section">
            <h2>Reports</h2>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Plagiarism %</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id}>
                    <td>{r.student}</td>
                    <td>{r.plagiarism}%</td>
                    <td>{r.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Analytics Section */}
        {activeSection === "analytics" && (
          <section className="section dashboard-cards">
            <div className="card">
              <h2>{submissions.length}</h2>
              <p>Total Submissions</p>
            </div>
            <div className="card">
              <h2>{submissions.filter(s => s.status === "Pending").length}</h2>
              <p>Pending Reviews</p>
            </div>
            <div className="card">
              <h2>{(reports.reduce((acc, r) => acc + (100 - r.plagiarism), 0) / reports.length).toFixed(1)}%</h2>
              <p>Originality Average</p>
            </div>
          </section>
        )}

        {/* Profile Section */}
        {activeSection === "profile" && (
          <section className="section">
            <h2>Your Profile</h2>
            <p>Name: Dr. Sanika Deshmukh</p>
            <p>Email: sanika@example.com</p>
            <p>Department: Computer Science</p>
          </section>
        )}

        {/* Help Section */}
        {activeSection === "help" && (
          <section className="section">
            <h2>Help & FAQs</h2>
            <p>For queries, contact support@PlagiX.com</p>
            <ul>
              <li>How to mark submissions reviewed?</li>
              <li>How to download files?</li>
              <li>How to check reports and analytics?</li>
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
