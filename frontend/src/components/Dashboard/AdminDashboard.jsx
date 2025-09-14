import React, { useState } from "react";
import "./AdminDashboard.css";
import logo from "../../assets/logo1.png";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
        
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeSection === "overview" ? "active" : ""}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </li>
          <li
            className={activeSection === "teachers" ? "active" : ""}
            onClick={() => setActiveSection("teachers")}
          >
            Manage Teachers
          </li>
          <li
            className={activeSection === "students" ? "active" : ""}
            onClick={() => setActiveSection("students")}
          >
            Manage Students
          </li>
          <li
            className={activeSection === "reports" ? "active" : ""}
            onClick={() => setActiveSection("reports")}
          >
            Reports
          </li>
          <li
            className={activeSection === "dataset" ? "active" : ""}
            onClick={() => setActiveSection("dataset")}
          >
            Dataset
          </li>
          <li
            className={activeSection === "settings" ? "active" : ""}
            onClick={() => setActiveSection("settings")}
          >
            Settings
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeSection === "overview" && (
          <section>
            <h1>Welcome, Admin 👋</h1>
            <p>Here’s a quick overview of the system.</p>
          </section>
        )}

        {activeSection === "teachers" && (
          <section>
            <h2>Manage Teachers</h2>
            <p>Add / Remove / View Teachers</p>
            {/* later we’ll add table + forms */}
          </section>
        )}

        {activeSection === "students" && (
          <section>
            <h2>Manage Students</h2>
            <p>Block / Approve Students</p>
          </section>
        )}

        {activeSection === "reports" && (
          <section>
            <h2>Reports Management</h2>
            <p>View and approve plagiarism reports</p>
          </section>
        )}

        {activeSection === "dataset" && (
          <section>
            <h2>Dataset Upload</h2>
            <p>Upload previous project reports for plagiarism reference.</p>
            <input type="file" />
          </section>
        )}

        {activeSection === "settings" && (
          <section>
            <h2>System Settings</h2>
            <p>Change password, update institute info, etc.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
