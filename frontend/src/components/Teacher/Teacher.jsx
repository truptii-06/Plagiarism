// src/components/Teacher/Teacher.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import "./Teacher.css";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  User,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const Teacher = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [plagResult, setPlagResult] = useState(null);

  // -------------------------------
  // FETCH ALL SUBMISSIONS (REAL API)
  // -------------------------------
  useEffect(() => {
    fetch("http://localhost:5000/api/submissions/all")
      .then((r) => r.json())
      .then((data) => {
        console.log("Loaded submissions:", data);
        setSubmissions(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Logout
  const handleLogout = () => navigate("/signup");

  // Open Drawer
  const openDrawer = (sub) => {
    setSelected(sub);
    setPlagResult(null);
  };

  const closeDrawer = () => setSelected(null);

  // Update a submission within UI
  const updateSubmissionUI = (id, updates) => {
    setSubmissions((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...updates } : s))
    );

    if (selected?._id === id) {
      setSelected((old) => ({ ...old, ...updates }));
    }
  };

  // ---------------------------------
  // RUN REAL PLAGIARISM CHECK (API)
  // ---------------------------------
  const runPlagiarismCheck = async () => {
    if (!selected) return alert("No submission selected");

    try {
      const res = await fetch("http://localhost:5000/api/plagiarism/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: selected._id }),
      });

      const data = await res.json();
      console.log("Plagiarism result:", data);

      if (data.error) {
        alert("Python error: " + data.error);
        return;
      }

      const result = data.result || data;

      setPlagResult(result);

      // update UI after plagiarism check
      updateSubmissionUI(selected._id, {
        similarity: result.similarity,
        grammarIssues: result.grammar_issues,
        mostSimilarDoc: result.most_similar_doc,
        status: "Reviewed",
      });

      alert("Plagiarism check completed");

    } catch (err) {
      console.error(err);
      alert("Error running plagiarism check");
    }
  };

  // ---------------------------------
  // Dashboard Summary
  // ---------------------------------
  const DashboardView = () => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === "Pending").length;
    const reviewed = submissions.filter((s) => s.status === "Reviewed").length;

    const recent = submissions.slice(0, 3);

    return (
      <div>
        <h1>Teacher Dashboard</h1>

        <div className="cards-row">
          <div className="card small">
            <div className="card-title">Total Submissions</div>
            <div className="card-value">{total}</div>
          </div>

          <div className="card small">
            <div className="card-title">Pending</div>
            <div className="card-value">{pending}</div>
          </div>

          <div className="card small">
            <div className="card-title">Reviewed</div>
            <div className="card-value">{reviewed}</div>
          </div>
        </div>

        <div className="panel">
          <h3>Recent Submissions</h3>
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Project</th>
                <th>Group</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {recent.map((s) => (
                <tr key={s._id}>
                  <td>{s.studentName || "Unknown"}</td>
                  <td>{s.projectTitle}</td>
                  <td>{s.groupId || "-"}</td>
                  <td>
                    <span className={`status-badge ${s.status.toLowerCase()}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn primary small" onClick={() => openDrawer(s)}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ---------------------------------
  // Full Submissions Page
  // ---------------------------------
  const SubmissionsView = () => (
    <div>
      <h1>All Submissions</h1>

      <div className="panel">
        <table className="submissions-table wide">
          <thead>
            <tr>
              <th>Student</th>
              <th>Project</th>
              <th>Status</th>
              <th>Similarity</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((s) => (
              <tr key={s._id}>
                <td>{s.studentName || "Unknown"}</td>
                <td>{s.projectTitle}</td>
                <td>
                  <span className={`status-badge ${s.status.toLowerCase()}`}>
                    {s.status}
                  </span>
                </td>
                <td>{s.similarity ?? "—"}</td>

                <td>
                  <button className="btn primary small" onClick={() => openDrawer(s)}>
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ---------------------------------
  // MAIN RETURN JSX
  // ---------------------------------
  return (
    <div className="teacher-dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>PlagiX</h3>
          <span className="role-badge">Teacher</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/teacher/dashboard" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/teacher/submissions" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FileText size={18} />
            <span>Submissions</span>
          </NavLink>

          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="navbar">
          <div className="nav-centre">Teacher Dashboard</div>
          <div className="user-icon">
            <User size={22} />
          </div>
        </div>

        <div className="dashboard-content-area">
          <Routes>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="submissions" element={<SubmissionsView />} />
            <Route index element={<DashboardView />} />
          </Routes>
        </div>
      </main>

      {/* Drawer */}
      {selected && (
        <div className="drawer-backdrop" onClick={closeDrawer}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            
            <div className="drawer-header">
              <h3>Review Submission</h3>
              <button className="close-btn" onClick={closeDrawer}>✕</button>
            </div>

            <div className="drawer-body">
              <h4>{selected.projectTitle}</h4>
              <p><strong>Student:</strong> {selected.studentName || "Unknown"}</p>
              <p><strong>Group:</strong> {selected.groupId || "-"}</p>

              <hr />

              {/* Run Check */}
              <button className="btn primary" onClick={runPlagiarismCheck}>
                <Sparkles size={14} /> Run Plagiarism Check
              </button>

              {/* Result */}
              {plagResult && (
                <div className="panel result-panel">
                  <h4>Plagiarism Result</h4>
                  <p><strong>Similarity:</strong> {plagResult.similarity}%</p>
                  <p><strong>Grammar Issues:</strong> {plagResult.grammar_issues}</p>
                  <p><strong>Most Similar Document:</strong> {plagResult.most_similar_doc}</p>
                </div>
              )}

              <hr />

              <label>Feedback</label>
              <textarea id="feedback-box" defaultValue={selected.teacherFeedback} />

              <div className="drawer-actions">
              <button className="btn primary" 
                    onClick={async () => {
                      const feedback = document.getElementById("feedback-box").value;

                      const body = {
                        id: selected._id,
                        status: selected.status,
                        feedback,
                        similarity: selected.similarity,
                        grammarIssues: selected.grammarIssues,
                        mostSimilarDoc: selected.mostSimilarDoc
                      };

                      const res = await fetch("http://localhost:5000/api/submissions/review/save", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                      });

                      const data = await res.json();
                      if (data.success) {
                        alert("Review saved successfully!");
                        updateSubmissionUI(selected._id, data.submission);
                      } else {
                        alert("Error saving review");
                      }
                    }}
                  >
                    Save Review
                  </button>

                <button className="btn success" onClick={() => {
                  const val = document.getElementById("feedback-box").value;
                  updateSubmissionUI(selected._id, { teacherFeedback: val, status: "Reviewed" });
                }}>
                  <CheckCircle size={14} /> Reviewed
                </button>

                <button className="btn warn" onClick={() => {
                  const val = document.getElementById("feedback-box").value;
                  updateSubmissionUI(selected._id, { teacherFeedback: val, status: "Needs Correction" });
                }}>
                  <AlertTriangle size={14} /> Needs Correction
                </button> 

                <button className="btn danger" onClick={() => {
                  const val = document.getElementById("feedback-box").value;
                  updateSubmissionUI(selected._id, { teacherFeedback: val, status: "Rejected" });
                }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>

              <button className="btn ghost" onClick={() => alert(`Download: ${selected.fileName}`)}>
                <Download size={14} /> Download File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Teacher;
