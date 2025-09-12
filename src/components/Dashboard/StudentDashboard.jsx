import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("Student Name");
  const [submissions, setSubmissions] = useState([
    { id: 1, title: "Math Assignment", status: "Reviewed", plagiarism: "5%" },
    { id: 2, title: "Science Project", status: "Pending", plagiarism: "-" },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (!email || role !== "student") {
      navigate("/login");
    } else {
      setStudentName(email.split("@")[0]);
    }
  }, []);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newTitle || !file) return;

    const newSubmission = {
      id: submissions.length + 1,
      title: newTitle,
      status: "Pending",
      plagiarism: "-",
    };

    setSubmissions([newSubmission, ...submissions]);
    setNewTitle("");
    setFile(null);
    alert("Assignment uploaded successfully!");
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome, {studentName}</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="card">
          <h3>Total Submissions</h3>
          <p>{submissions.length}</p>
        </div>
        <div className="card">
          <h3>Pending Reviews</h3>
          <p>{submissions.filter((s) => s.status === "Pending").length}</p>
        </div>
        <div className="card">
          <h3>Average Plagiarism</h3>
          <p>
            {submissions
              .filter((s) => s.plagiarism !== "-")
              .reduce((acc, s) => acc + parseInt(s.plagiarism), 0) /
              submissions.filter((s) => s.plagiarism !== "-").length || 0}
            %
          </p>
        </div>
      </div>

      {/* Assignment Upload Section */}
      <div className="upload-section">
        <h2>Upload New Assignment</h2>
        <form className="upload-form" onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Assignment Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          {file && (
            <p className="file-preview">
              Selected File: <strong>{file.name}</strong>
            </p>
          )}
          <button type="submit">Upload</button>
        </form>
      </div>

      {/* Past Submissions */}
      <div className="submissions-table">
        <h2>Past Submissions</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Plagiarism %</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{sub.title}</td>
                <td>{sub.status}</td>
                <td>{sub.plagiarism}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
