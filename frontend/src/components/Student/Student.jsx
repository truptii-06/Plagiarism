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
  const [codeSubmissionsList, setCodeSubmissionsList] = useState([]);

  // FILTERED LISTS
  const reportSubmissions = submissions.filter(s => !s.category || s.category === 'Report');
  const codeSubmissions = codeSubmissionsList; // Now fetching directly from separate DB collection

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

      // 1. Fetch Report Submissions (legacy/original endpoint)
      const resReports = await fetch(`http://localhost:5000/api/submissions/student/${studentId}`);
      const dataReports = await resReports.json();
      setSubmissions(dataReports);

      // 2. Fetch Code Submissions (new separate endpoint)
      const resCode = await fetch(`http://localhost:5000/api/code-submissions/student/${studentId}`);
      const dataCode = await resCode.json();
      setCodeSubmissionsList(dataCode);

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
    // Determine Endpoint based on Active Page
    let endpoint = 'http://localhost:5000/api/submissions/upload';
    if (activePage === 'code-submissions') {
      endpoint = 'http://localhost:5000/api/code-submissions/upload';
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: fd,
        // no Content-Type header when sending FormData
      });

      const data = await res.json();
      if (data.success) {
        if (activePage === 'code-submissions') {
          setCodeSubmissionsList((prev) => [data.submission, ...prev]);
        } else {
          setSubmissions((prev) => [data.submission, ...prev]);
        }
        setProjectTitle('');
        setProjectDesc('');
        setUploadFile(null);
        if (fileRef.current) fileRef.current.value = '';

        setUploadFile(null);
        if (fileRef.current) fileRef.current.value = '';

        if (activePage === 'code-submissions') {
          // Stay on code submissions or maybe show success message
          alert('Code Project uploaded!');
        } else {
          setActivePage('submissions'); // Go to report submissions
          alert('Project Report uploaded!');
        }
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
    // For now, just redirect to upload page to create a NEW submission
    // The old one remains as history (Rejected)
    setActivePage('dashboard');
    alert("Please upload the corrected version as a new submission.");
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
            <span>Project Reports</span>
          </button>

          <button
            type="button"
            className={
              activePage === 'code-submissions' ? 'nav-item active' : 'nav-item'
            }
            onClick={() => setActivePage('code-submissions')}
          >
            <Code size={18} />
            <span>Code Submissions</span>
          </button>

          <button
            type="button"
            className={
              activePage === 'code-plagiarism' ? 'nav-item active' : 'nav-item'
            }
            onClick={() => setActivePage('code-plagiarism')}
          >
            <Code size={18} />
            <span>Check Similarity</span>
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
                <h3>Submit Project Report</h3>
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

          {/* Submissions List View (REPORTS ONLY) */}
          {activePage === 'submissions' && (
            <div className="student-dashboard-container">
              <h3>My Project Reports</h3>

              {reportSubmissions.length === 0 ? (
                <div className="no-data">No report submissions yet</div>
              ) : (
                <table className="submissions-table">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Plagiarism (%)</th>
                      {/* CEI Column Removed from Report View */}
                      <th>Report</th>
                      <th>Feedback</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportSubmissions.map((s) => (
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



        {activePage === 'code-submissions' && (
          <div className="student-dashboard-container">
            {/* 1. Upload Section for Code */}
            <div className="upload-card" style={{ marginBottom: '40px' }}>
              <h3>Submit Code Project</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Upload your source code files (.py, .java, .js, .cpp) for AI and Similarity Analysis.
              </p>
              <form onSubmit={submitProject}>
                <div className="form-group">
                  <label>Submission Type</label>
                  <div className="radio-group" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'normal' }}>
                      <input type="radio" name="profileType" value="Individual" checked={profile.profileType === 'Individual'} onChange={(e) => updateProfileField('profileType', e.target.value)} style={{ width: 'auto', marginRight: '8px' }} /> Individual
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'normal' }}>
                      <input type="radio" name="profileType" value="Group" checked={profile.profileType === 'Group'} onChange={(e) => updateProfileField('profileType', e.target.value)} style={{ width: 'auto', marginRight: '8px' }} /> Group
                    </label>
                  </div>
                </div>

                {profile.profileType === 'Individual' ? (
                  <div className="form-group">
                    <label>Student ID</label>
                    <input type="text" value={generalProfile.studentId} readOnly style={{ background: '#f5f5f5', cursor: 'not-allowed' }} />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Group ID</label>
                    <input type="text" value={profile.groupId} onChange={(e) => updateProfileField('groupId', e.target.value)} placeholder="Enter Group ID" required />
                  </div>
                )}

                <div className="form-group">
                  <label>Project Title</label>
                  <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Brief Description</label>
                  <textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} rows="2" />
                </div>

                <div className="form-group">
                  <label>Code File (.py, .java, .js, .cpp)</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".py,.java,.js,.cpp,.c"
                    onChange={onFileChange}
                    required
                  />
                </div>

                <button className="primary-btn wide" type="submit" disabled={!projectTitle || !uploadFile} style={{ marginTop: '10px' }}>
                  Submit Code
                </button>
              </form>
            </div>

            {/* 2. List Section for Code */}
            <h3>My Code Submissions</h3>
            {codeSubmissions.length === 0 ? (
              <div className="no-data">No code submissions yet</div>
            ) : (
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>Project Title</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>AI Analysis (CEI)</th>
                    <th>Feedback</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {codeSubmissions.map((s) => (
                    <tr key={s._id}>
                      <td>{s.projectTitle}</td>
                      <td>{new Date(s.date).toLocaleDateString()}</td>
                      <td><span className={`status-badge ${s.status.toLowerCase()}`}>{s.status}</span></td>
                      <td>
                        {s.ceiLabel ? (
                          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
                            <span style={{ fontWeight: 600, color: s.ceiScore > 1.2 ? '#e11d48' : '#059669' }}>
                              {s.ceiLabel}
                            </span>
                            {s.ceiScore && <span style={{ color: '#666' }}>Score: {s.ceiScore}</span>}
                          </div>
                        ) : (s.status === 'Accepted' || s.status === 'Reviewed' ? 'Not Analyze' : '-')}
                      </td>
                      <td>{s.teacherFeedback || '-'}</td>
                      <td>
                        <button type="button" className="download-link" onClick={() => handleDownload(s.fileName)}>
                          <Download size={14} /> File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
