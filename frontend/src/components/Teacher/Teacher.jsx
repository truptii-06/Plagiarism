// src/components/Teacher/Teacher.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate, useParams } from "react-router-dom";
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
  ScanText,
  ArrowLeft,
  Code,
  Camera,
  UserCircle
} from "lucide-react";
import "../Student/PlagiarismTools.css";
import CodePlagiarism from "../Student/CodePlagiarism";

const Teacher = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [activePage, setActivePage] = useState('dashboard'); // Added to manage sub-routes better if needed, but Teacher uses actual Routes.

  // GENERAL PROFILE INFO
  const [generalProfile, setGeneralProfile] = useState({
    teacherName: '',
    organization: '',
    email: '',
    phone: '',
    profilePic: ''
  });

  // -------------------------------
  // FETCH ALL SUBMISSIONS (REAL API)
  // -------------------------------
  // LOAD GENERAL PROFILE
  const loadGeneralProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`http://localhost:5000/api/profile/teacher/${userId}`);
      const data = await res.json();
      if (data && data._id) {
        setGeneralProfile({
          teacherName: data.teacherName || '',
          organization: data.organization || '',
          email: data.email || '',
          phone: data.phone || '',
          profilePic: data.profilePic || ''
        });
      }
    } catch (err) {
      console.error('Error loading general profile:', err);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/submissions/all")
      .then((r) => r.json())
      .then((data) => {
        setSubmissions(data);
      })
      .catch((err) => console.error("Fetch error:", err));

    loadGeneralProfile();
  }, []);

  const updateGeneralField = (field, value) => {
    setGeneralProfile((p) => ({ ...p, [field]: value }));
  };

  const handleUpdateGeneralProfile = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: 'teacher',
          ...generalProfile
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated!");
      } else {
        alert(data.error || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userId = localStorage.getItem("userId");
    const fd = new FormData();
    fd.append("profilePic", file);
    fd.append("userId", userId);
    fd.append("role", "teacher");

    try {
      const res = await fetch("http://localhost:5000/api/profile/upload-pic", {
        method: "POST",
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        setGeneralProfile(prev => ({ ...prev, profilePic: data.profilePic }));
        alert("Profile picture updated!");
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading picture.");
    }
  };

  // Logout
  const handleLogout = () => navigate("/signup");

  // Update a submission within UI
  const updateSubmissionUI = (id, updates) => {
    setSubmissions((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...updates } : s))
    );
  };

  // ---------------------------------
  // RUN REAL PLAGIARISM CHECK (API)
  // ---------------------------------
  const runPlagiarismCheck = async (subId) => {
    try {
      const res = await fetch("http://localhost:5000/api/plagiarism/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: subId }),
      });

      const data = await res.json();
      if (data.error) {
        alert("Python error: " + data.error);
        return null;
      }
      return data.result || data;
    } catch (err) {
      console.error(err);
      alert("Error running plagiarism check");
      return null;
    }
  };

  // ---------------------------------
  // Dashboard Summary
  // ---------------------------------
  const DashboardView = () => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === "Pending").length;
    const accepted = submissions.filter((s) => s.status === "Accepted").length;

    const recent = submissions.slice(0, 5);

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
            <div className="card-title">Accepted</div>
            <div className="card-value">{accepted}</div>
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
                    <button className="btn primary small" onClick={() => navigate(`/teacher/review/${s._id}`)}>
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
  // Full Submissions Page (History)
  // ---------------------------------
  const SubmissionsView = () => {
    const history = submissions.filter(s => s.status === "Accepted" || s.status === "Rejected");

    return (
      <div>
        <h1>Review History</h1>
        <div className="panel">
          {history.length === 0 ? (
            <p style={{ padding: '20px', color: '#666' }}>No processed submissions yet.</p>
          ) : (
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
                {history.map((s) => (
                  <tr key={s._id}>
                    <td>{s.studentName || "Unknown"}</td>
                    <td>{s.projectTitle}</td>
                    <td>
                      <span className={`status-badge ${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{s.similarity !== null ? `${s.similarity}%` : "—"}</td>
                    <td>
                      <button className="btn ghost small" onClick={() => navigate(`/teacher/review/${s._id}`)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  // ---------------------------------
  // DEDICATED REVIEW PAGE VIEW
  // ---------------------------------
  const ReviewPageView = () => {
    const { id } = useParams();
    const submission = submissions.find(s => s._id === id);
    const [localResult, setLocalResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
      if (submission) {
        setFeedback(submission.teacherFeedback || "");
        if (submission.similarity !== null) {
          setLocalResult({
            similarity: submission.similarity,
            grammar_issues: submission.grammarIssues,
            most_similar_doc: submission.mostSimilarDoc
          });
        }
      }
    }, [submission]);

    if (!submission) return <div style={{ padding: '20px' }}>Loading Submission Details...</div>;

    const handleAction = async (newStatus) => {
      const body = {
        id: submission._id,
        status: newStatus,
        feedback,
        similarity: localResult?.similarity,
        grammarIssues: localResult?.grammar_issues,
        mostSimilarDoc: localResult?.most_similar_doc
      };

      try {
        const res = await fetch("http://localhost:5000/api/submissions/review/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
          alert(`Submission ${newStatus} Successfully!`);
          updateSubmissionUI(submission._id, data.submission);
          navigate("/teacher/dashboard");
        }
      } catch (err) {
        alert("Error saving review");
      }
    };

    const triggerCheck = async () => {
      setLoading(true);
      const res = await runPlagiarismCheck(submission._id);
      if (res) {
        setLocalResult(res);
      }
      setLoading(false);
    };

    return (
      <div className="review-page-container">
        <div className="review-header">
          <h2>Review Submission</h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back
          </button>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Project Title</label>
            <span>{submission.projectTitle}</span>
          </div>
          <div className="info-item">
            <label>Student / Group</label>
            <span>{submission.studentName || submission.customStudentId || submission.customGroupId || "Unknown"}</span>
          </div>
          <div className="info-item">
            <label>Date Submitted</label>
            <span>{new Date(submission.date).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <label>Current Status</label>
            <span className={`status-badge ${submission.status.toLowerCase()}`}>{submission.status}</span>
          </div>
        </div>

        <div className="plag-check-row">
          <div>
            <p style={{ fontWeight: 600 }}>Plagiarism Analysis</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Check similarity against millions of records.</p>
          </div>
          <button className="btn primary" onClick={triggerCheck} disabled={loading}>
            <Sparkles size={14} /> {loading ? "Analyzing..." : "Run Plagiarism Check"}
          </button>
        </div>

        {localResult && (
          <div className={`result-section ${localResult.similarity > 20 ? 'ai-detected' : 'human-detected'}`} style={{ marginBottom: '30px', animation: 'fadeIn 0.5s' }}>
            <div className="result-header">
              <div className="result-icon">
                {localResult.similarity > 20 ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
              </div>
              <div className="result-title">
                {localResult.similarity > 20 ? 'Similarity Detected' : 'No Significant Plagiarism'}
              </div>
            </div>

            <div className="confidence-meter">
              <div className="meter-label">
                <span>Similarity Score</span>
                <span>{localResult.similarity}%</span>
              </div>
              <div className="progress-track" style={{ background: '#eee', height: '10px' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(localResult.similarity, 100)}%`,
                    background: localResult.similarity > 50 ? '#f43f5e' : (localResult.similarity > 20 ? '#fbbf24' : '#10b981')
                  }}
                ></div>
              </div>
            </div>

            <div className="result-details" style={{ marginTop: '15px' }}>
              <p><strong>Most Similar Document:</strong> {localResult.most_similar_doc || "None"}</p>
              {localResult.grammar_issues !== undefined && (
                <p><strong>Grammar Issues Found:</strong> {localResult.grammar_issues}</p>
              )}
            </div>
          </div>
        )}

        <div className="feedback-section">
          <label>Add Feedback</label>
          <textarea
            className="feedback-textarea"
            placeholder="Provide comments for the student..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="review-actions">
          <button className="btn success" onClick={() => handleAction("Accepted")}>
            <CheckCircle size={20} /> Accept Project
          </button>
          <button className="btn danger" onClick={() => handleAction("Rejected")}>
            <XCircle size={20} /> Reject Project
          </button>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button className="btn ghost" style={{ margin: '0 auto' }} onClick={() => alert(`Downloading ${submission.fileName}...`)}>
            <Download size={14} /> Download Submission File
          </button>
        </div>
      </div>
    );
  };

  const ProfileView = () => {
    return (
      <div className="dashboard-content-area fadeIn">
        <div className="profile-viewer-container">
          <div className="profile-pic-section">
            <div className="pic-wrapper">
              {generalProfile.profilePic ? (
                <img
                  src={`http://localhost:5000/${generalProfile.profilePic}`}
                  alt="Profile"
                  className="large-profile-pic"
                />
              ) : (
                <UserCircle size={120} color="#ccc" />
              )}
              <label className="upload-icon-btn">
                <Camera size={20} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                />
              </label>
            </div>
            <h3>{generalProfile.teacherName}</h3>
            <p className="role-text">Teacher / Instructor</p>
          </div>

          <div className="profile-details-grid">
            <div className="details-card">
              <h4>Personal Details</h4>
              <form onSubmit={handleUpdateGeneralProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={generalProfile.teacherName}
                    onChange={(e) => updateGeneralField('teacherName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Organization / University</label>
                  <input
                    type="text"
                    value={generalProfile.organization}
                    onChange={(e) => updateGeneralField('organization', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={generalProfile.email}
                    readOnly
                    style={{ background: '#eee' }}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={generalProfile.phone}
                    onChange={(e) => updateGeneralField('phone', e.target.value)}
                  />
                </div>
                <button type="submit" className="primary-btn">Update Profile</button>
              </form>
            </div>

            <div className="details-card">
              <h4>Account Information</h4>
              <div className="settings-item">
                <span>Username</span>
                <strong>{localStorage.getItem('username')}</strong>
              </div>
              <div className="settings-item">
                <span>Role</span>
                <strong>Teacher</strong>
              </div>
              <button
                className="logout-btn-alt"
                onClick={handleLogout}
                style={{ marginTop: '50px' }}
              >
                Logout Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------------
  // MAIN RETURN JSX
  // ---------------------------------
  return (
    <div className="teacher-dashboard">
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
          <NavLink to="/teacher/manual-check" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <ScanText size={18} />
            <span>Manual Check</span>
          </NavLink>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="navbar">
          <div className="nav-centre">Teacher Dashboard</div>
          <div className="nav-right" onClick={() => navigate("/teacher/profile")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {generalProfile.profilePic ? (
              <img
                src={`http://localhost:5000/${generalProfile.profilePic}`}
                alt="Profile"
                className="nav-profile-pic"
              />
            ) : (
              <UserCircle color="#fff" size={26} />
            )}
          </div>
        </div>
        <div className="dashboard-content-area">
          <Routes>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="submissions" element={<SubmissionsView />} />
            <Route path="manual-check" element={<div className="dashboard-content-area"><CodePlagiarism /></div>} />
            <Route path="review/:id" element={<ReviewPageView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route index element={<DashboardView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Teacher;
