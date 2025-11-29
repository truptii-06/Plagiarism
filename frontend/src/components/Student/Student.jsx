// src/components/Student/Student.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  UserCircle,
  Download,
} from 'lucide-react';
import './Student.css';

const Student = () => {
  const navigate = useNavigate();

  // PAGE STATE
  const [activePage, setActivePage] = useState('dashboard');

  // PROFILE INFO
  const [profile, setProfile] = useState({
    fullName: '',
    studentId: '',
    groupId: '',
    groupMembers: [''],
  });

  // SUBMISSIONS
  const [submissions, setSubmissions] = useState([]);

  // FILE UPLOAD
  const fileRef = useRef(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  // LOAD STUDENT SUBMISSIONS
  const loadSubmissions = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) return;

      const res = await fetch(
        `http://localhost:5000/api/submissions/student/${studentId}`
      );
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // PROFILE FIELD HANDLER
  const updateProfileField = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const saveProfile = (e) => {
    e.preventDefault();
    alert('Profile saved (mock). Backend integration pending.');
  };

  // FILE CHANGE
  const onFileChange = (e) => {
    setUploadFile(e.target.files?.[0] ?? null);
  };

  // SUBMIT PROJECT
  const submitProject = async (e) => {
    e.preventDefault();

    if (!projectTitle || !uploadFile) {
      alert('Please provide a project title and file.');
      return;
    }

    const studentId = localStorage.getItem('studentId');
    if (!studentId) return alert('Login error. Student ID missing.');

    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('studentId', studentId);
    fd.append('projectTitle', projectTitle);
    fd.append('description', projectDesc);

    try {
      const res = await fetch('http://localhost:5000/api/submissions/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (data.success) {
        setSubmissions((prev) => [data.submission, ...prev]);
        setProjectTitle('');
        setProjectDesc('');
        setUploadFile(null);
        if (fileRef.current) fileRef.current.value = '';
        setActivePage('submissions');

        alert('Project uploaded!');
      } else {
        alert(data.error || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error.');
    }
  };

  // RE-SUBMIT
  const handleResubmit = (id) => {
    alert('Re-upload feature will be added later.');
  };

  // DOWNLOAD FILE
  const handleDownload = (url) => {
    if (!url) return alert('Report not ready.');
    window.open(url, '_blank');
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate('/signup');
  };

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">PlagiX</h2>

        <div className="sidebar-nav">
          <button
            type="button"
            className={
              activePage === 'dashboard' ? 'nav-item active' : 'nav-item'
            }
            onClick={() => setActivePage('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={
              activePage === 'submissions' ? 'nav-item active' : 'nav-item'
            }
            onClick={() => setActivePage('submissions')}
          >
            <FileText size={18} />
            <span>My Submissions</span>
          </button>

          <button type="button" className="nav-item" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="navbar">
          <div className="nav-centre">Student Dashboard</div>

          <div className="nav-right">
            <span className="welcome">Welcome back!</span>
            <UserCircle color="#fff" size={26} />
          </div>
        </div>

        <div className="dashboard-content-area">
          {/* FIX: Logic moved directly into the main return to avoid re-renders */}
          {activePage === 'dashboard' && (
            <div className="student-dashboard-container">
              <div className="profile-card">
                <h3>Student Information</h3>

                <form onSubmit={saveProfile} className="profile-form">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      updateProfileField('fullName', e.target.value)
                    }
                    placeholder="e.g. Alex Johnson"
                  />

                  <label>Student ID</label>
                  <input
                    type="text"
                    value={profile.studentId}
                    onChange={(e) =>
                      updateProfileField('studentId', e.target.value)
                    }
                    placeholder="e.g. ST2024001"
                  />

                  <label>Group ID</label>
                  <input
                    type="text"
                    value={profile.groupId}
                    onChange={(e) =>
                      updateProfileField('groupId', e.target.value)
                    }
                    placeholder="Group ID (optional)"
                  />

                  <label>Group Members</label>
                  {profile.groupMembers.map((m, i) => (
                    <input
                      key={i}
                      type="text"
                      value={m}
                      onChange={(e) => {
                        const copy = [...profile.groupMembers];
                        copy[i] = e.target.value;
                        updateProfileField('groupMembers', copy);
                      }}
                      placeholder="Member name"
                    />
                  ))}

                  <div className="buttons-row">
                    <button
                      type="button"
                      className="small-btn"
                      onClick={() =>
                        updateProfileField('groupMembers', [
                          ...profile.groupMembers,
                          '',
                        ])
                      }
                    >
                      + Add Member
                    </button>

                    <button type="submit" className="primary-btn">
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>

              {/* Submit Project */}
              <div className="upload-card">
                <h3>Submit New Project</h3>

                <form onSubmit={submitProject}>
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Enter project title"
                  />

                  <label>Description</label>
                  <textarea
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="Short project description"
                  />

                  <label>Project File</label>
                  <input ref={fileRef} type="file" onChange={onFileChange} />

                  <button
                    className="primary-btn"
                    type="submit"
                    style={{ marginTop: '12px' }}
                  >
                    Submit Project
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Submissions List View */}
          {activePage === 'submissions' && (
            <div className="student-dashboard-container">
              <h3>My Submissions</h3>

              {submissions.length === 0 ? (
                <div className="no-data">No submissions yet</div>
              ) : (
                <table className="submissions-table">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Plagiarism (%)</th>
                      <th>Report</th>
                      <th>Feedback</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {submissions.map((s) => (
                      <tr key={s._id}>
                        <td>{s.projectTitle}</td>
                        <td>{new Date(s.date).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`status-badge ${s.status.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td>{s.similarity ? `${s.similarity}%` : '-'}</td>
                        <td>
                          <button
                            type="button"
                            className="download-link"
                            onClick={() => handleDownload(s.fileUrl)}
                          >
                            <Download size={14} /> View
                          </button>
                        </td>
                        <td>{s.teacherFeedback || '-'}</td>
                        <td>
                          {['Rejected', 'Needs Correction'].includes(
                            s.status
                          ) ? (
                            <button
                              type="button"
                              className="small-btn"
                              onClick={() => handleResubmit(s._id)}
                            >
                              Re-submit
                            </button>
                          ) : (
                            <span className="muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Student;
