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
  UserCircle,
  Database
} from "lucide-react";
import "../Student/PlagiarismTools.css";
import CodePlagiarism from "../Student/CodePlagiarism";
import DatasetManagement from "./DatasetManagement";

const Teacher = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [codeSubmissions, setCodeSubmissions] = useState([]);
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
    // Fetch Report Submissions
    fetch("http://localhost:5000/api/submissions/all")
      .then((r) => r.json())
      .then((data) => {
        const safeData = Array.isArray(data)
          ? data.filter(s => s && typeof s === "object")
          : [];

        setSubmissions(safeData);
      })
      .catch((err) => console.error("Fetch error:", err));

    // Fetch Code Submissions
    fetch("http://localhost:5000/api/code-submissions/all")
      .then((r) => r.json())
      .then((data) => {
        setCodeSubmissions(data);
      })
      .catch((err) => console.error("Fetch code subs error:", err));

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
  const handleLogout = () => navigate("/homepage");

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

  const runCEICheck = async (subId) => {
    try {
      const res = await fetch("http://localhost:5000/api/plagiarism/check-cei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: subId }),
      });

      const data = await res.json();
      if (data.error) {
        alert("CEI Analysis error: " + data.error);
        return null;
      }
      return data.result;
    } catch (err) {
      console.error(err);
      alert("Error running CEI analysis");
      return null;
    }
  };

  // ---------------------------------
  // Dashboard Summary
  // ---------------------------------
  const DashboardView = () => {
    const total = submissions.length;
    const pending = submissions.filter(
      (s) => s?.status?.toLowerCase() === "pending"
    ).length;

    const accepted = submissions.filter(
      (s) => s?.status?.toLowerCase() === "accepted"
    ).length;


    const recent = submissions.filter(
      (s) =>
        s &&
        typeof s === "object" &&
        (!s.category || s.category === "Report") &&
        s.status?.toLowerCase() === "pending"
    );



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
          <h3>Pending Report Submissions</h3>
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
  // Report Submissions View
  // ---------------------------------
  const SubmissionsView = () => {
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredReports = submissions
      .filter(
        (s) =>
          s &&
          (!s.category || s.category === "Report")
      )
      .filter((s) => {
        if (statusFilter === "all") return true;
        return s.status?.toLowerCase() === statusFilter;
      })
      .filter((s) =>
        s.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return (
      <div className="report-page">
        <h1>Report Submissions</h1>

        {/* FILTER BAR */}
        <div className="report-filters">
          <input
            type="text"
            placeholder="Search by project or student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-dropdown"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="panel">
          {filteredReports.length === 0 ? (
            <p className="empty-text">No matching submissions found.</p>
          ) : (
            <table className="submissions-table wide">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Similarity</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((s) => (
                  <tr key={s._id}>
                    <td>{s.studentName || "Unknown"}</td>
                    <td>{s.projectTitle}</td>
                    <td>
                      <span className={`status-badge ${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{s.similarity != null ? `${s.similarity}%` : "—"}</td>
                    <td>
                      <button
                        className="btn ghost small"
                        onClick={() => navigate(`/teacher/review/${s._id}`)}
                      >
                        View
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
  // Code Submissions View
  // ---------------------------------
  const CodeSubmissionsView = () => {
    // Show Pending AND Processed for Code Submissions
    const codeSubs = codeSubmissions;

    return (
      <div>
        <h1>Code Submissions</h1>
        <div className="panel">
          {codeSubs.length === 0 ? (
            <p style={{ padding: '20px', color: '#666' }}>No code submissions yet.</p>
          ) : (
            <table className="submissions-table wide">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>AI Analysis (CEI)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {codeSubs.map((s) => (
                  <tr key={s._id}>
                    <td>{s.studentName || "Unknown"}</td>
                    <td>{s.projectTitle}</td>
                    <td>
                      <span className={`status-badge ${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.ceiLabel ? (
                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
                          <span style={{ fontWeight: 600, color: s.ceiScore > 1.2 ? '#e11d48' : '#059669' }}>
                            {s.ceiLabel}
                          </span>
                          {s.ceiScore && <span style={{ color: '#666' }}>Score: {s.ceiScore}</span>}
                        </div>
                      ) : (s.status === 'Accepted' || s.status === 'Reviewed' ? 'Not Analyzed' : '-')}
                    </td>
                    <td>
                      <button className="btn primary small" onClick={() => navigate(`/teacher/review-code/${s._id}`)}>
                        Review Code
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
    const [viewResults, setViewResults] = useState(false);
    const [localResult, setLocalResult] = useState(null);
    const [ceiResult, setCeiResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ceiLoading, setCeiLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
      if (submission) {
        setFeedback(submission.teacherFeedback || "");
        if (submission.similarity !== null) {
          // FORCE CLEAN: If the most similar doc is the old default one, ignore it so user re-runs it
          // This fixes the issue where user sees "default result" first
          if (submission.mostSimilarDoc !== "PlagixSurvey 1.docx") {
            setLocalResult({
              similarity: submission.similarity,
              most_similar_doc: submission.mostSimilarDoc,
              matched_snippet: submission.matchedSnippet,
              matchedMetadata: submission.matchedMetadata
            });
          }
        }
        if (submission.ceiScore !== undefined && submission.ceiScore !== null) {
          setCeiResult({
            CEI_score: submission.ceiScore,
            label: submission.ceiLabel,
            metrics: submission.ceiMetrics
          });
        }
      }
    }, [submission]);

    if (!submission) return <div style={{ padding: '20px' }}>Loading Submission Details...</div>;

    const handleAction = async (newStatus) => {
      if (!submission || !submission._id) {
        alert("Submission not loaded");
        return;
      }

      const payload = {
        id: submission._id,
        status: newStatus,
        teacherFeedback: feedback,
        similarity: localResult?.similarity,
        mostSimilarDoc: localResult?.most_similar_doc
      };

      try {
        const res = await fetch(
          "http://localhost:5000/api/submissions/review/save",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );

        const data = await res.json();

        if (!data.success) {
          alert(data.error || "Failed to update submission");
          return;
        }

        // ✅ UPDATE STATUS — DO NOT REMOVE
        setSubmissions(prev =>
          prev.map(s =>
            s && s._id === submission._id
              ? { ...s, status: newStatus, teacherFeedback: feedback }
              : s
          )
        );

        alert(`Submission ${newStatus} successfully`);
        navigate("/teacher/dashboard");

      } catch (err) {
        console.error(err);
        alert("Server error while saving review");
      }
    };


    const triggerCheck = async () => {
  setLoading(true);

  const res = await runPlagiarismCheck(submission._id);

  if (res) {
    setLocalResult({
      ...res,
      matchedMetadata: res.matchedMetadata
    });
    setViewResults(true); // ✅ show result immediately
  }

  setLoading(false);
};


    const triggerCEICheck = async () => {
      setCeiLoading(true);
      const res = await runCEICheck(submission._id);
      if (res) {
        setCeiResult(res);
      }
      setCeiLoading(false);
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
            <Sparkles size={14} /> {loading ? "Analyzing..." : (viewResults && localResult ? "Re-run Plagiarism Check" : "Run Plagiarism Check")}
          </button>
        </div>

        {(viewResults && localResult) && (
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
              {localResult.matchedMetadata && (localResult.matchedMetadata.projectTitle || localResult.matchedMetadata.groupMembers) ? (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Matched Source Details</h4>
                  <table className="submissions-table" style={{ width: '100%', fontSize: '13px' }}>
                    <tbody>
                      {localResult.matchedMetadata.projectTitle && (
                        <tr style={{ background: '#f8fafc' }}>
                          <td style={{ fontWeight: 600, color: '#334155', padding: '8px', width: '30%' }}>Project Title</td>
                          <td style={{ padding: '8px', color: '#0f172a', fontWeight: 600 }}>{localResult.matchedMetadata.projectTitle}</td>
                        </tr>
                      )}
                      {localResult.matchedMetadata.problemStatement && (
                        <tr>
                          <td style={{ fontWeight: 600, color: '#64748b', padding: '8px' }}>Problem Statement</td>
                          <td style={{ padding: '8px', color: '#334155' }}>{localResult.matchedMetadata.problemStatement}</td>
                        </tr>
                      )}
                      {localResult.matchedMetadata.projectGuide && (
                        <tr>
                          <td style={{ fontWeight: 600, color: '#64748b', padding: '8px' }}>Guide Name</td>
                          <td style={{ padding: '8px', color: '#334155' }}>{localResult.matchedMetadata.projectGuide}</td>
                        </tr>
                      )}
                      {localResult.matchedMetadata.groupMembers && (
                        <tr>
                          <td style={{ fontWeight: 600, color: '#64748b', padding: '8px' }}>Group Members</td>
                          <td style={{ padding: '8px', color: '#334155' }}>{localResult.matchedMetadata.groupMembers}</td>
                        </tr>
                      )}
                      {/* {localResult.matchedMetadata.academicYear && (
                        <tr>
                          <td style={{ fontWeight: 600, color: '#64748b', padding: '8px' }}>Academic Year</td>
                          <td style={{ padding: '8px', color: '#334155' }}>{localResult.matchedMetadata.academicYear}</td>
                        </tr>
                      )} */}
                      {localResult.matchedMetadata.sourceLink && (
                        <tr>
                          <td style={{ fontWeight: 600, color: '#64748b', padding: '8px' }}>Source Link</td>
                          <td style={{ padding: '8px', color: '#2563eb' }}>
                            <a href={localResult.matchedMetadata.sourceLink.replace(/\s/g, "")} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                              View Source Document
                            </a>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ marginBottom: '15px' }}>
                  <p><strong>Most Similar Document:</strong> {localResult.most_similar_doc || "None"}</p>
                  <p style={{ fontSize: '12px', color: '#ef4444', background: '#fef2f2', padding: '8px', borderRadius: '4px', border: '1px solid #fee2e2' }}>
                    <strong>Metadata Missing:</strong> Detailed info (Title, Students, etc.) isn't available for this match.
                    Please delete and re-upload the dataset in "Manage Datasets" to capture this information.
                  </p>
                </div>
              )}

              {localResult.matched_snippet && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Matched Content Snippet:</p>
                  <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: '#334155' }}>"{localResult.matched_snippet}"</p>
                </div>
              )}
            </div>

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
        )}
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
  // DEDICATED CODE REVIEW PAGE VIEW
  // ---------------------------------
  const ReviewCodePageView = () => {
    const { id } = useParams();
    // Look up in codeSubmissions
    const submission = submissions.find(s => s && s._id === id);

    // Local state for results and feedback
    const [ceiResult, setCeiResult] = useState(null);
    const [ceiLoading, setCeiLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
      if (submission) {
        setFeedback(submission.teacherFeedback || "");
        if (submission.ceiScore !== undefined && submission.ceiScore !== null) {
          setCeiResult({
            CEI_score: submission.ceiScore,
            label: submission.ceiLabel,
            metrics: submission.ceiMetrics
          });
        }
      }
    }, [submission]);

    if (!submission) return <div style={{ padding: '20px' }}>Loading Code Submission Details...</div>;

    const handleCodeAction = async (newStatus) => {
      const body = {
        status: newStatus,
        teacherFeedback: feedback
      };

      try {
        const res = await fetch(`http://localhost:5000/api/code-submissions/update/${submission._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
          alert(`Code Submission ${newStatus}!`);
          // Update local state to reflect change without refetch
          setCodeSubmissions(prev => prev.map(s => s._id === submission._id ? data.submission : s));
          navigate("/teacher/code-submissions");
        }
      } catch (err) {
        alert("Error updating code review");
      }
    };

    const triggerCEICheck = async () => {
      setCeiLoading(true);
      // Run internal CEI Check (ensure plagiarismController handles CodeSubmission model)
      const res = await runCEICheck(submission._id);
      if (res) {
        setCeiResult(res);
        // We may need to update the backend record explicitly if runCEICheck doesn't save to DB 
        // OR reload the code submission to get the saved CEI result.
        // runCEICheck usually saves to DB. 
        // Let's refetch this specific submission to update our list state or just trust the result.
        // Ideally update the state:
        setCodeSubmissions(prev => prev.map(s => s._id === submission._id ? { ...s, ceiScore: res.CEI_score, ceiLabel: res.label, ceiMetrics: res.metrics } : s));
      }
      setCeiLoading(false);
    };

    return (
      <div className="teacher-dashboard" style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px' }}>
        <div className="review-page">
          <button className="back-btn" onClick={() => navigate("/teacher/code-submissions")} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to List
          </button>

          {/* HERO CARD */}
          <div className="glass-card">
            <div className="code-review-hero">
              <div className="hero-title">
                <h2>{submission.projectTitle}</h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span className="code-badge"><User size={14} /> {submission.studentName}</span>
                  <span className="code-badge"><Code size={14} /> {new Date(submission.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <button className="btn ghost" onClick={() => window.open(`http://localhost:5000/${submission.fileUrl}`, '_blank')} style={{ border: '1px solid #e2e8f0' }}>
                  <Download size={18} /> Download Source
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#334155' }}>AI Content Analysis</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Run the CEI algorithm to detect AI-generated patterns.</p>
              </div>
              <button className="ai-analysis-btn" onClick={triggerCEICheck} disabled={ceiLoading}>
                {ceiLoading ? <Sparkles className="analyzing-pulse" /> : <Sparkles />}
                {ceiLoading ? "Analyzing Logic..." : "Run Intelligence Analysis"}
              </button>
            </div>
          </div>

          {/* RESULT CARD (Modern) */}
          {ceiResult && (
            <div className="result-card">
              {/* Header */}
              <div className={`result-header-modern ${ceiResult.CEI_score > 1.2 ? 'ai' : 'human'}`}>
                <div className="status-icon-large">
                  {ceiResult.CEI_score > 1.2 ? <AlertTriangle /> : <CheckCircle />}
                </div>
                <div className="result-main-info">
                  <h3>{ceiResult.label}</h3>
                  <p>{ceiResult.CEI_score > 1.2 ? "High likelihood of AI generation detected." : "Content appears consistent with human styling."}</p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <span style={{ fontSize: '32px', fontWeight: '800', color: ceiResult.CEI_score > 1.2 ? '#e11d48' : '#059669' }}>
                    {ceiResult.CEI_score}
                  </span>
                  <div style={{ fontSize: '12px', opacity: 0.7, fontWeight: 600 }}>CEI SCORE</div>
                </div>
              </div>

              {/* Gauge */}
              <div className="gauge-container">
                <div className="gauge-label">
                  <span>Human-like</span>
                  <span>Suspicious</span>
                </div>
                <div className="gauge-track">
                  <div
                    className="gauge-fill"
                    style={{
                      width: `${Math.min((ceiResult.CEI_score / 3) * 100, 100)}%`,
                      background: ceiResult.CEI_score > 1.2
                        ? 'linear-gradient(90deg, #fbbf24, #ef4444)'
                        : 'linear-gradient(90deg, #22c55e, #10b981)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Metrics */}
              {ceiResult.metrics && (
                <div className="metrics-grid-modern">
                  <div className="metric-card">
                    <div className="metric-title">Complexity Variance</div>
                    <div className="metric-value">{ceiResult.metrics.complexity_variance}</div>
                    <div className="metric-desc">Low variance often indicates AI</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-title">Identifier Entropy</div>
                    <div className="metric-value">{ceiResult.metrics.identifier_entropy}</div>
                    <div className="metric-desc">Naming uniqueness score</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-title">Indent Pattern</div>
                    <div className="metric-value">{ceiResult.metrics.indent_variance}</div>
                    <div className="metric-desc">Structural consistency</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FEEDBACK SECTION */}
          <div className="glass-card" style={{ marginTop: '25px' }}>
            <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Instructor Feedback</h3>
            <textarea
              className="feedback-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback for the student..."
              style={{ background: '#f8fafc' }}
            />
            <div className="review-actions">
              <button className="btn danger" onClick={() => handleCodeAction("Rejected")} style={{ flex: 1, height: '45px', fontSize: '15px' }}>
                <XCircle size={18} /> Reject Submission
              </button>
              <button className="btn success" onClick={() => handleCodeAction("Accepted")} style={{ flex: 1, height: '45px', fontSize: '15px' }}>
                <CheckCircle size={18} /> Approve Submission
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
            <span>Report Submissions</span>
          </NavLink>
          <NavLink to="/teacher/code-submissions" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <Code size={18} />
            <span>Code Submissions</span>
          </NavLink>
          <NavLink to="/teacher/manual-check" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <ScanText size={18} />
            <span>Manual Check</span>
          </NavLink>
          <NavLink to="/teacher/datasets" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <Database size={18} />
            <span>Manage Datasets</span>
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
            <Route path="code-submissions" element={<CodeSubmissionsView />} />
            <Route path="manual-check" element={<div className="dashboard-content-area"><CodePlagiarism /></div>} />
            <Route path="datasets" element={<DatasetManagement />} />
            <Route path="review/:id" element={<ReviewPageView />} />
            <Route path="review-code/:id" element={<ReviewCodePageView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route index element={<DashboardView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Teacher;
