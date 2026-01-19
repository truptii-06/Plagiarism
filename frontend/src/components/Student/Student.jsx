// src/components/Student/Student.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  UserCircle,
  Download,
  Code,
  ScanText,
  Camera
} from 'lucide-react';
import './Student.css';
import CodePlagiarism from './CodePlagiarism';
import TextPlagiarism from './TextPlagiarism';

const Student = () => {
  const navigate = useNavigate();

  // PAGE STATE
  const [activePage, setActivePage] = useState('dashboard');

  // PROJECT PROFILE INFO (Project specific)
  const [profile, setProfile] = useState({
    profileType: 'Individual', // 'Individual' | 'Group'
    fullName: '',
    studentId: '',
    guideName: '',
    groupId: '',
    groupMembers: [''],
  });

  // GENERAL PROFILE INFO (Personal details)
  const [generalProfile, setGeneralProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePic: '',
    studentId: '' // Auth studentId
  });

  // SUBMISSIONS
  const [submissions, setSubmissions] = useState([]);

  // FILE UPLOAD
  const fileRef = useRef(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  // New States removed (submissionType, projectIdInput moved to profile)

  // LOAD STUDENT SUBMISSIONS
  const loadSubmissions = async () => {
    try {
      const studentId = localStorage.getItem("userId");
      if (!studentId) return;
      const res = await fetch(`http://localhost:5000/api/submissions/student/${studentId}`);
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  };

  // LOAD STUDENT PROFILE
  const loadProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`http://localhost:5000/api/student/profile/${userId}`);
      const data = await res.json();
      if (data && data.userId) {
        setProfile({
          profileType: data.profileType || 'Individual',
          fullName: data.fullName || '',
          studentId: data.studentId || '',
          guideName: data.guideName || '',
          groupId: data.groupId || '',
          groupMembers: data.members && data.members.length ? data.members : [''],
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  // LOAD GENERAL PROFILE (Personal details)
  const loadGeneralProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`http://localhost:5000/api/profile/student/${userId}`);
      const data = await res.json();
      if (data && data._id) {
        setGeneralProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          profilePic: data.profilePic || '',
          studentId: data.studentId || ''
        });
      }
    } catch (err) {
      console.error('Error loading general profile:', err);
    }
  };

  useEffect(() => {
    loadSubmissions();
    loadProfile();
    loadGeneralProfile();
  }, []);

  // PROFILE FIELD HANDLER
  const updateProfileField = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Login error: userId missing.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/student/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          fullName: profile.fullName,
          studentId: profile.studentId,
          guideName: profile.guideName,
          groupId: profile.groupId,
          members: profile.groupMembers,
          profileType: profile.profileType,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile saved successfully!");
      } else {
        alert(data.error || "Save failed.");
      }

    } catch (err) {
      console.error("Save error:", err);
      alert("Server error");
    }
  };

  // GENERAL PROFILE HANDLERS
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
          role: 'student',
          ...generalProfile
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Personal profile updated!");
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
    fd.append("role", "student");

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

    const studentId = localStorage.getItem("userId");
    if (!studentId) return alert('Login error. Student ID missing.');

    let customId = "";
    if (profile.profileType === 'Individual') {
      customId = generalProfile.studentId;
    } else {
      if (!profile.groupId) {
        alert('Please provide a Group ID for group submission.');
        return;
      }
      customId = profile.groupId;
    }

    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append("studentId", studentId);
    fd.append('projectTitle', projectTitle);
    fd.append('description', projectDesc);
    fd.append('submissionType', profile.profileType);
    fd.append('customId', customId);

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
  const handleDownload = (fileName) => {
    window.open(`http://localhost:5000/api/submissions/download/${fileName}`, "_blank");
  };

  const handleDownloadReport = (subId) => {
    window.open(`http://localhost:5000/api/plagiarism/report/${subId}`, "_blank");
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

          <button
            type="button"
            className={
              activePage === 'code-plagiarism' ? 'nav-item active' : 'nav-item'
            }
            onClick={() => setActivePage('code-plagiarism')}
          >
            <Code size={18} />
            <span>Code Plagiarism</span>
          </button>

          <button
            type="button"
            className={
              activePage === 'text-plagiarism' ? 'nav-item active' : 'nav-item'
            }
            onClick={() => setActivePage('text-plagiarism')}
          >
            <ScanText size={18} />
            <span>Text Plagiarism</span>
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

          <div className="nav-right" onClick={() => setActivePage('profile')} style={{ cursor: 'pointer' }}>
            <span className="welcome">Welcome back!</span>
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
          {/* Main Dashboard View */}
          {activePage === 'dashboard' && (
            <div className="student-dashboard-container">
              {/* Submit Project Section */}
              <div className="upload-card">
                <h3>Submit New Project</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                  Select your submission type and upload your project report.
                </p>

                <form onSubmit={submitProject}>
                  <div className="form-group">
                    <label>Submission Type</label>
                    <div className="radio-group" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'normal' }}>
                        <input
                          type="radio"
                          name="profileType"
                          value="Individual"
                          checked={profile.profileType === 'Individual'}
                          onChange={(e) => updateProfileField('profileType', e.target.value)}
                          style={{ width: 'auto', marginRight: '8px' }}
                        /> Individual
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'normal' }}>
                        <input
                          type="radio"
                          name="profileType"
                          value="Group"
                          checked={profile.profileType === 'Group'}
                          onChange={(e) => updateProfileField('profileType', e.target.value)}
                          style={{ width: 'auto', marginRight: '8px' }}
                        /> Group
                      </label>
                    </div>
                  </div>

                  {profile.profileType === 'Individual' ? (
                    <div className="form-group">
                      <label>Student ID (Reference)</label>
                      <input
                        type="text"
                        value={generalProfile.studentId}
                        readOnly
                        style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Group ID (e.g. GRP-05)</label>
                      <input
                        type="text"
                        value={profile.groupId}
                        onChange={(e) => updateProfileField('groupId', e.target.value)}
                        placeholder="Enter your Group ID"
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Project Title</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Smart Traffic Management"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Brief Description</label>
                    <textarea
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      placeholder="Provide a short summary of your work..."
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>Project Document (PDF, DOCX, TXT)</label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={onFileChange}
                      required
                    />
                  </div>

                  <button
                    className="primary-btn wide"
                    type="submit"
                    disabled={!projectTitle || !uploadFile}
                    style={{ marginTop: '10px' }}
                  >
                    Submit for Review
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
                            onClick={() => handleDownload(s.fileName)}
                          >
                            <Download size={14} /> File
                          </button>
                          {s.status !== 'Pending' && (
                            <button
                              type="button"
                              className="report-link"
                              onClick={() => handleDownloadReport(s._id)}
                              style={{ display: 'block', marginTop: '5px', color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}
                            >
                              <FileText size={14} /> Report
                            </button>
                          )}

                        </td>
                        <td>{s.teacherFeedback || '-'}</td>
                        <td>
                          {['Rejected'].includes(
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

        {/* New Pages within content area or just below if using same padding */}
        {activePage === 'code-plagiarism' && (
          <div className="dashboard-content-area">
            <CodePlagiarism showSimilarity={false} />
          </div>
        )}

        {activePage === 'text-plagiarism' && (
          <div className="dashboard-content-area">
            <TextPlagiarism />
          </div>
        )}

        {activePage === 'profile' && (
          <div className="dashboard-content-area">
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
                <h3>{generalProfile.firstName} {generalProfile.lastName}</h3>
                <p className="role-text">Student</p>
              </div>

              <div className="profile-details-grid">
                <div className="details-card">
                  <h4>Personal Details</h4>
                  <form onSubmit={handleUpdateGeneralProfile}>
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={generalProfile.firstName}
                        onChange={(e) => updateGeneralField('firstName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={generalProfile.lastName}
                        onChange={(e) => updateGeneralField('lastName', e.target.value)}
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
                    <button type="submit" className="primary-btn">Update Details</button>
                  </form>
                </div>

                <div className="details-card">
                  <h4>Account Settings</h4>
                  <div className="settings-item">
                    <span>Student ID</span>
                    <strong>{generalProfile.studentId}</strong>
                  </div>
                  <div className="settings-item">
                    <span>Username</span>
                    <strong>{localStorage.getItem('username')}</strong>
                  </div>
                  <button
                    className="logout-btn-alt"
                    onClick={handleLogout}
                  >
                    Logout Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Student;
