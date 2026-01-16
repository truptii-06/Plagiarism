// src/components/common/StudentDashboard.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import './StudentDashboard.css';
import { SubmissionsContext } from '../../context/SubmissionsContext.jsx';
import {
  UploadCloud,
  Trash2,
  Plus,
  X,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react';

/*
  Professional Student Dashboard
  - Uses SubmissionsContext.addSubmission(submission)
  - Stores/reads current user in localStorage.plagix_user
  - Includes file preview modal for PDFs using object URL
*/

const seedTeachers = [
  { id: 't_1', name: 'Dr. Priya Rao' },
  { id: 't_2', name: 'Mr. Rahul Verma' },
];

function getTeachers() {
  const raw = localStorage.getItem('plagix_teachers');
  if (!raw) {
    localStorage.setItem('plagix_teachers', JSON.stringify(seedTeachers));
    return seedTeachers;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return seedTeachers;
  }
}

const emptyUser = {
  id: '',
  name: '',
  role: 'student',
  groupName: '',
  groupId: '',
  groupMembers: [],
};

const StudentDashboard = () => {
  const { addSubmission, submissions } = useContext(SubmissionsContext);

  // load current user from localStorage
  const stored =
    typeof window !== 'undefined' ? localStorage.getItem('plagix_user') : null;
  const currentUser = stored ? JSON.parse(stored) : null;

  const [user, setUser] = useState(currentUser || emptyUser);
  const [editMode, setEditMode] = useState(false);

  // submission form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // UI helpers
  const [toast, setToast] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);
  const teachers = getTeachers();

  // recent submissions for this student
  const mySubmissions = submissions
    ? submissions.filter((s) => s.studentId === user.id)
    : [];

  useEffect(() => {
    // make sure groupMembers exist as array (backwards compat)
    if (!Array.isArray(user.groupMembers)) {
      setUser((prev) => ({ ...prev, groupMembers: [] }));
    }
  }, []);

  const showToast = (text, ms = 2200) => {
    setToast(text);
    setTimeout(() => setToast(''), ms);
  };

  const saveProfile = () => {
    if (!user.name.trim() || !user.id.trim()) {
      showToast('Please enter name and student ID.');
      return;
    }
    const toSave = { ...user, role: 'student' };
    localStorage.setItem('plagix_user', JSON.stringify(toSave));
    setUser(toSave);
    setEditMode(false);
    showToast('Profile saved');
  };

  const clearProfile = () => {
    localStorage.removeItem('plagix_user');
    setUser(emptyUser);
    showToast('Profile cleared');
  };

  // group members dynamic
  const addMember = (name) => {
    if (!name || !name.trim()) return;
    setUser((prev) => ({
      ...prev,
      groupMembers: [...(prev.groupMembers || []), name.trim()],
    }));
  };
  const removeMember = (index) => {
    setUser((prev) => ({
      ...prev,
      groupMembers: prev.groupMembers.filter((_, i) => i !== index),
    }));
  };

  // file handling
  const handleFile = (f) => {
    if (!f) return;
    const allowedExt = /\.(pdf|docx?|txt)$/i;
    if (!allowedExt.test(f.name)) {
      setFile(null);
      setFileError('Only PDF, DOC/DOCX, TXT allowed');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setFile(null);
      setFileError('File must be ≤ 10MB');
      return;
    }
    setFileError('');
    setFile(f);
    // prepare preview url if pdf
    if (/\.pdf$/i.test(f.name)) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const openPreview = () => {
    if (!previewUrl)
      return showToast('No preview available for this file type');
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Submit project
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return showToast('Enter project title');
    if (!user.name || !user.id)
      return showToast('Save profile before submitting');

    setSubmitting(true);
    try {
      // In real app: upload file to storage (S3/Supabase) and store URL.
      const submission = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        filename: file ? file.name : null,
        fileType: file ? file.type : null,
        fileSize: file ? file.size : null,
        studentId: user.id,
        studentName: user.name,
        groupName: user.groupName || '',
        groupId: user.groupId || '',
        groupMembers: user.groupMembers || [],
        assignedTeacherId: null, // teacher assignment flow handled elsewhere
        status: 'pending',
        originalityScore: null,
        date: new Date().toLocaleString(),
      };

      // add to context
      await addSubmission(submission);

      // nice success states
      setTitle('');
      setDescription('');
      setFile(null);
      setPreviewUrl(null);
      showToast('Project submitted successfully');
    } catch (err) {
      console.error(err);
      showToast('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  // small progress / counts for quick view
  const total = mySubmissions.length;
  const pending = mySubmissions.filter((s) => s.status === 'pending').length;
  const reviewed = mySubmissions.filter((s) => s.status === 'reviewed').length;

  return (
    <div className="pdash-root">
      <div className="pdash-header">
        <div className="pdash-title">
          <h1>Student Dashboard</h1>
          <p className="muted">
            Submit projects, manage your group, and track your submissions.
          </p>
        </div>

        <div className="pdash-user">
          <div className="avatar">
            <span>{(user.name || 'S').charAt(0).toUpperCase()}</span>
          </div>
          <div className="user-meta">
            <div className="user-name">{user.name || 'Your name'}</div>
            <div className="user-id muted">
              {user.id ? `ID: ${user.id}` : 'Not logged'}
            </div>
          </div>
          <div className="user-actions">
            <button
              className="btn-ghost"
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? 'Close' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="pdash-grid">
        {/* Left column: profile + submissions */}
        <div className="col-left">
          <div className={`card profile-card ${editMode ? 'editing' : ''}`}>
            <div className="profile-top">
              <div>
                <h3>{user.name || 'Student Information'}</h3>
                <p className="muted">
                  Keep your profile up to date so teachers can identify your
                  submission.
                </p>
              </div>
              <div className="profile-stats">
                <div className="stat">
                  <div className="num">{total}</div>
                  <div className="label muted">Total</div>
                </div>
                <div className="stat">
                  <div className="num">{pending}</div>
                  <div className="label muted">Pending</div>
                </div>
                <div className="stat">
                  <div className="num">{reviewed}</div>
                  <div className="label muted">Reviewed</div>
                </div>
              </div>
            </div>

            <div className="profile-body">
              <div className="profile-row">
                <label>Full name</label>
                <input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                />
              </div>

              <div className="profile-row">
                <label>Student ID</label>
                <input
                  value={user.id}
                  onChange={(e) => setUser({ ...user, id: e.target.value })}
                  placeholder="e.g. ST2024001"
                />
              </div>

              <div className="profile-row">
                <label>Group / Project name</label>
                <input
                  value={user.groupName || ''}
                  onChange={(e) =>
                    setUser({ ...user, groupName: e.target.value })
                  }
                  placeholder="Project title or group name (optional)"
                />
              </div>

              <div className="profile-row">
                <label>Group ID</label>
                <input
                  value={user.groupId || ''}
                  onChange={(e) =>
                    setUser({ ...user, groupId: e.target.value })
                  }
                  placeholder="Group ID (optional)"
                />
              </div>

              <div className="profile-row">
                <label>Group Members</label>
                <div className="members-input">
                  <MemberInputList
                    members={user.groupMembers || []}
                    onAdd={(v) => addMember(v)}
                    onRemove={(i) => removeMember(i)}
                  />
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn-primary" onClick={saveProfile}>
                  Save profile
                </button>
                <button className="btn-outline" onClick={clearProfile}>
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="card submissions-card">
            <div className="card-head">
              <h3>My Submissions</h3>
              <p className="muted">Recent projects you've submitted</p>
            </div>

            <div className="submission-list">
              {mySubmissions.length === 0 && (
                <div className="empty">
                  No submissions yet — submit your first project below.
                </div>
              )}

              {mySubmissions
                .slice(0)
                .reverse()
                .map((s) => (
                  <div className="submission-row" key={s.id}>
                    <div className="left">
                      <div className="title">{s.title}</div>
                      <div className="meta muted">
                        {s.date} • {s.filename || 'No file'}
                      </div>
                    </div>
                    <div className="right">
                      <StatusBadge
                        status={s.status}
                        score={s.originalityScore}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right column: submit form */}
        <div className="col-right">
          {/* AI Code Inspector */}
          <div className="card ai-inspector-card">
            <div className="card-head">
              <div className="ai-title">
                <h3><span role="img" aria-label="robot">🤖</span> AI Code Inspector</h3>
              </div>
              <p className="muted">Check if your code looks AI-generated before submitting.</p>
            </div>

            <AICodeInspector />
          </div>

          <div className="card submit-card">
            <div className="card-head">
              <h3>Submit Assignment</h3>
              <p className="muted">
                Upload your work for final grading.
              </p>
            </div>

            <form className="submit-form" onSubmit={handleSubmit}>
              <label>Project title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
              />

              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short project description (optional)"
              ></textarea>

              <label>Project file</label>
              <div
                className="file-drop"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInput}
                />
                <div className="file-drop-inner">
                  <UploadCloud size={32} />
                  <div className="fd-text">
                    Click to upload or drag &amp; drop
                  </div>
                  <div className="fd-sub muted">
                    PDF, DOC, DOCX, TXT — up to 10MB
                  </div>

                  {file && (
                    <div className="file-preview">
                      <div className="file-info">
                        <FileText size={18} />
                        <div>
                          <div className="filename">{file.name}</div>
                          <div className="filesize muted">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>

                      <div className="file-actions">
                        {previewUrl && (
                          <button
                            type="button"
                            className="btn-link"
                            onClick={openPreview}
                          >
                            Preview
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-clear"
                          onClick={() => {
                            setFile(null);
                            setPreviewUrl(null);
                            setFileError('');
                          }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  )}

                  {fileError && <div className="error">{fileError}</div>}
                </div>
              </div>

              <div className="submit-controls">
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Clock size={14} /> Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* preview modal */}
      {previewOpen && previewUrl && (
        <div className="modal" role="dialog" onClick={closePreview}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h4>File preview</h4>
              <button className="btn-clear" onClick={closePreview}>
                <X size={16} />
              </button>
            </div>
            <div className="pdf-wrap">
              <iframe src={previewUrl} title="preview" />
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

// small reusable components
const MemberInputList = ({ members = [], onAdd, onRemove }) => {
  const [val, setVal] = useState('');
  return (
    <div>
      <div className="chips">
        {members.map((m, i) => (
          <div className="chip" key={i}>
            {m}
            <button
              className="chip-x"
              onClick={() => onRemove(i)}
              aria-label={`Remove ${m}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="chip-input">
        <input
          placeholder="Add member name"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (val.trim()) {
                onAdd(val);
                setVal('');
              }
            }
          }}
        />
        <button
          className="btn-add"
          onClick={() => {
            if (val.trim()) {
              onAdd(val);
              setVal('');
            }
          }}
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, score }) => {
  if (status === 'reviewed')
    return (
      <div className="badge reviewed">
        <CheckCircle size={14} /> Reviewed
      </div>
    );
  if (status === 'pending')
    return <div className="badge pending">⏱ Pending</div>;
  if (status === 'flagged')
    return <div className="badge flagged">⚠ Flagged</div>;
  return <div className="badge">Unknown</div>;
};

const AICodeInspector = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
    setResult(null);
    setError('');
  };

  const runCheck = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/plagiarism/ai-check', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.result) {
        setResult(data.result);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-inspector-body">
      <div className="ai-upload-row">
        <input type="file" onChange={handleFile} accept=".py,.java,.js,.cpp" />
        <button className="btn-primary" onClick={runCheck} disabled={!file || loading}>
          {loading ? 'Analyzing...' : 'Check Code'}
        </button>
      </div>

      {result && (
        <div className={`ai-result ${result.prediction === 'AI' ? 'is-ai' : 'is-human'}`}>
          <div className="ai-res-header">
            {result.prediction === 'AI' ? '⚠️ AI-Generated' : '✅ Human-Written'}
          </div>
          <div className="ai-confidence">
            Confidence: <strong>{result.confidence.toFixed(1)}%</strong>
          </div>
          <div className="ai-bar-wrap">
            <div className="ai-bar" style={{ width: `${result.confidence}%` }}></div>
          </div>
          <div className="ai-note">Based on stylometric analysis (naming, comments, structure).</div>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}
    </div>
  );
};

export default StudentDashboard;
