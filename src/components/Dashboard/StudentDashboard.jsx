import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import logo from "../../assets/logo1.png";

const StudentDashboard = () => {
  const [files, setFiles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState("upload");

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const newEntry = {
        name: uploadedFile.name,
        date: new Date().toLocaleDateString(),
        status: "Processing",
        score: null,
      };

      setFiles([newEntry, ...files]);
      setNotifications([
        { message: `${uploadedFile.name} uploaded successfully!`, type: "success" },
        ...notifications,
      ]);

      // Simulate plagiarism score after few seconds
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((file) =>
            file.name === uploadedFile.name
              ? { ...file, status: "Completed", score: "12%" }
              : file
          )
        );
        setNotifications([
          { message: `Report ready for ${uploadedFile.name}`, type: "info" },
          ...notifications,
        ]);
      }, 3000);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeSection === "upload" ? "active" : ""}
            onClick={() => setActiveSection("upload")}
          >
            Upload
          </li>
          <li
            className={activeSection === "history" ? "active" : ""}
            onClick={() => setActiveSection("history")}
          >
            History
          </li>
          <li
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </li>
          <li
            className={activeSection === "help" ? "active" : ""}
            onClick={() => setActiveSection("help")}
          >
            Help
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Welcome back, Student 👋</h1>
          <p>Ready to check your assignments today?</p>
        </section>

        {/* Upload Section */}
        {activeSection === "upload" && (
          <section className="upload-section">
            <h2>Upload Assignment / Report</h2>
            <div className="upload-box">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden-input"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="upload-btn">
                Choose File
              </label>
              <p className="upload-note">
                Supported: PDF, DOCX, TXT,.zip, Code files
              </p>
            </div>
          </section>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <section className="notifications-section">
            <h2>Notifications</h2>
            <ul>
              {notifications.map((note, index) => (
                <li
                  key={index}
                  className={`notification ${
                    note.type === "success" ? "success" : "info"
                  }`}
                >
                  {note.message}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Submission History */}
        {activeSection === "history" && (
          <section className="history-section">
            <h2>Submission History</h2>
            {files.length === 0 ? (
              <p className="no-history">No submissions yet.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Plagiarism Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr key={index}>
                        <td>{file.name}</td>
                        <td>{file.date}</td>
                        <td>{file.status}</td>
                        <td>{file.score ? file.score : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Profile Section */}
        {activeSection === "profile" && (
          <section className="profile-section">
            <h2>Your Profile</h2>
            <p>Student Name: John Doe</p>
            <p>Roll No: 123456</p>
            <p>Email: student@example.com</p>
          </section>
        )}

        {/* Help Section */}
        {activeSection === "help" && (
          <section className="help-section">
            <h2>Need Help?</h2>
            <p>
              For queries, contact your faculty or email support@PlagiX.com.
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;