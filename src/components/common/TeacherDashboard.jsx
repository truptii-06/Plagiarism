// src/components/common/TeacherDashboard.jsx
import React, { useContext, useMemo, useState } from 'react';
import './TeacherDashboard.css';
import { SubmissionsContext } from '../../context/SubmissionsContext.jsx';
import {
  Eye,
  Download,
  Search as SearchIcon,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const TeacherDashboard = () => {
  const { submissions, updateSubmission } = useContext(SubmissionsContext);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [flaggingReason, setFlaggingReason] = useState('');
  const [checkingId, setCheckingId] = useState(null);

  // Filtered list based on search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter(
      (s) =>
        (s.title || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.studentName || 'unknown').toLowerCase().includes(q)
    );
  }, [submissions, query]);

  const selected = submissions.find((s) => s.id === selectedId) || null;

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
    setFeedbackText('');
    setFlaggingReason('');
  };

  const handleDownload = (s) => {
    // demo/download placeholder (no real file in localStorage)
    if (!s.filename) {
      alert(
        'No file stored in demo. In production, download the file from your storage (S3/Supabase).'
      );
      return;
    }
    alert(`Download placeholder: ${s.filename}`);
  };

  const handleView = (s) => {
    // demo view: show details in right panel by selecting it
    setSelectedId(s.id);
  };

  const handleCheckPlagiarism = async (s) => {
    setCheckingId(s.id);
    // Simulate async plagiarism check
    await new Promise((r) => setTimeout(r, 900));
    // simulate result
    const simulatedScore = Math.floor(30 + Math.random() * 70); // 30-99
    updateSubmission(s.id, { originalityScore: simulatedScore });
    setCheckingId(null);
    alert(`Plagiarism check complete — originality: ${simulatedScore}%`);
  };

  const sendFeedback = () => {
    if (!selected) return alert('Select a submission to send feedback.');
    if (!feedbackText.trim()) return alert('Enter feedback text.');
    updateSubmission(selected.id, {
      feedback: feedbackText.trim(),
      status: 'reviewed',
    });
    setFeedbackText('');
    alert('Feedback saved and submission marked reviewed.');
  };

  const flagSubmission = () => {
    if (!selected) return alert('Select a submission to flag.');
    if (!flaggingReason.trim()) return alert('Enter reason for flagging.');
    updateSubmission(selected.id, {
      status: 'flagged',
      flagReason: flaggingReason.trim(),
    });
    setFlaggingReason('');
    alert('Submission flagged.');
  };

  // Quick stats
  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === 'pending').length;
    const flagged = submissions.filter((s) => s.status === 'flagged').length;
    const reviewed = submissions.filter((s) => s.status === 'reviewed').length;
    return { total, pending, flagged, reviewed };
  }, [submissions]);

  return (
    <div className="teacher-dashboard-page">
      <h1>Teacher Dashboard</h1>

      <div className="teacher-grid">
        <div className="left-column">
          <div className="card submissions-card">
            <div className="card-header">
              <h2>Student Submissions</h2>
              <p className="muted">
                Review and provide feedback on student projects
              </p>
            </div>

            <div className="search-row">
              <div className="search-box">
                <SearchIcon size={16} />
                <input
                  placeholder="Search by student name or project title..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="submissions-list">
              {filtered.length === 0 && (
                <div className="empty">No submissions found.</div>
              )}

              {filtered.map((s) => (
                <div
                  key={s.id}
                  className={`submission-item ${selectedId === s.id ? 'active' : ''}`}
                >
                  <div className="submission-main">
                    <div className="submission-head">
                      <h3>{s.title}</h3>
                      <div className="status-right">
                        {s.status === 'reviewed' && (
                          <span className="status-pill green">
                            <CheckCircle size={14} /> reviewed
                          </span>
                        )}
                        {s.status === 'pending' && (
                          <span className="status-pill yellow">⏱ pending</span>
                        )}
                        {s.status === 'flagged' && (
                          <span className="status-pill red">
                            <AlertTriangle size={14} /> flagged
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="submission-meta">
                      <div className="student-name">
                        👤 {s.studentName || 'Unknown'}
                      </div>
                      <div className="short-desc">{s.description}</div>
                      <div className="submitted-date">Submitted: {s.date}</div>
                    </div>

                    <div className="submission-actions">
                      <button
                        onClick={() => handleView(s)}
                        className="btn-outline"
                      >
                        <Eye size={14} /> View
                      </button>

                      <button
                        onClick={() => handleCheckPlagiarism(s)}
                        className="btn-outline"
                        disabled={checkingId === s.id}
                      >
                        {checkingId === s.id
                          ? 'Checking...'
                          : 'Check Plagiarism'}
                      </button>

                      <button
                        onClick={() => handleDownload(s)}
                        className="btn-outline"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>

                  <div className="right-side">
                    {typeof s.originalityScore === 'number' && (
                      <div
                        className={`originality ${s.originalityScore >= 75 ? 'good' : s.originalityScore >= 50 ? 'avg' : 'bad'}`}
                      >
                        Originality: <strong>{s.originalityScore}%</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback panel */}
          <div className="card feedback-card">
            <div className="card-header">
              <h2>Provide Feedback</h2>
              <p className="muted">
                Review selected submission and provide detailed feedback
              </p>
            </div>

            {!selected && (
              <div className="empty large">
                <div className="icon">💬</div>
                <p>Select a submission to provide feedback</p>
              </div>
            )}

            {selected && (
              <div className="feedback-panel">
                <h3>{selected.title}</h3>
                <p className="muted">
                  By: {selected.studentName || 'Unknown'} • Submitted:{' '}
                  {selected.date}
                </p>

                <label>Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={5}
                  placeholder="Write feedback here..."
                />

                <div className="feedback-actions">
                  <button className="primary" onClick={sendFeedback}>
                    Send Feedback & Mark Reviewed
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() => {
                      setFeedbackText(selected.feedback || '');
                    }}
                  >
                    Load Existing
                  </button>
                </div>

                <hr />

                <label>Flag Submission (use only for policy issues)</label>
                <input
                  placeholder="Reason for flagging"
                  value={flaggingReason}
                  onChange={(e) => setFlaggingReason(e.target.value)}
                />
                <div style={{ marginTop: 8 }}>
                  <button className="danger" onClick={flagSubmission}>
                    Flag Submission
                  </button>
                </div>

                {selected.feedback && (
                  <div className="existing-feedback">
                    <strong>Existing feedback:</strong>
                    <p>{selected.feedback}</p>
                  </div>
                )}

                {selected.status === 'flagged' && selected.flagReason && (
                  <div className="flag-info">
                    <strong>Flag reason:</strong>
                    <p>{selected.flagReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="right-column">
          <div className="card stats-card">
            <h3>Quick Stats</h3>
            <div className="stat-row">
              <div className="stat-left">Total Submissions</div>
              <div className="stat-right">{stats.total}</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Pending Review</div>
              <div className="stat-right yellow">{stats.pending}</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Flagged</div>
              <div className="stat-right red">{stats.flagged}</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Reviewed</div>
              <div className="stat-right green">{stats.reviewed}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
