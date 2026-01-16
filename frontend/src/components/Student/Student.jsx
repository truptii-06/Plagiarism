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

    // Validate Profile Data before submission
    let customId = "";
    if (profile.profileType === 'Individual') {
      if (!profile.studentId) {
        alert('Please save your Student ID in the Profile section first.');
        return;
      }
      customId = profile.studentId;
    } else {
      if (!profile.groupId) {
        alert('Please save your Group ID in the Profile section first.');
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
    if (profile.guideName) fd.append('guideName', profile.guideName);

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
          {/* FIX: Logic moved directly into the main return to avoid re-renders */}
          {activePage === 'dashboard' && (
            <div className="student-dashboard-container">
              <div className="profile-card">
                <h3>Student Information</h3>

                <form onSubmit={handleSaveProfile} className="profile-form">
                  {/* PROJECT TYPE SELECTION */}
                  <label>Project Type</label>
                  <div className="radio-group" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="profileType"
                        value="Individual"
                        checked={profile.profileType === 'Individual'}
                        onChange={(e) => updateProfileField('profileType', e.target.value)}
                        style={{ width: 'auto', marginRight: '8px', marginBottom: 0 }}
                      /> Individual
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="profileType"
                        value="Group"
                        checked={profile.profileType === 'Group'}
                        onChange={(e) => updateProfileField('profileType', e.target.value)}
                        style={{ width: 'auto', marginRight: '8px', marginBottom: 0 }}
                      /> Group
                    </label>
                  </div>

                  {/* INDIVIDUAL FIELDS */}
                  {profile.profileType === 'Individual' && (
                    <>
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => updateProfileField('fullName', e.target.value)}
                        placeholder="e.g. Alex Johnson"
                      />

                      <label>Student ID</label>
                      <input
                        type="text"
                        value={profile.studentId}
                        onChange={(e) => updateProfileField('studentId', e.target.value)}
                        placeholder="e.g. ST2024001"
                      />

                      <label>Guide Name</label>
                      <input
                        type="text"
                        value={profile.guideName}
                        onChange={(e) => updateProfileField('guideName', e.target.value)}
                        placeholder="e.g. Dr. Jane Smith"
                      />
                    </>
                  )}

                  {/* GROUP FIELDS */}
                  {profile.profileType === 'Group' && (
                    <>
                      <label>Group ID</label>
                      <input
                        type="text"
                        value={profile.groupId}
                        onChange={(e) => updateProfileField('groupId', e.target.value)}
                        placeholder="Group ID (e.g. GRP-05)"
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

                      <button
                        type="button"
                        className="small-btn"
                        onClick={() =>
                          updateProfileField('groupMembers', [
                            ...profile.groupMembers,
                            '',
                          ])
                        }
                        style={{ marginTop: '-5px', marginBottom: '15px' }}
                      >
                        + Add Member
                      </button>
                    </>
                  )}

                  <div className="buttons-row">
                    <button type="submit" className="primary-btn">
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>

              {/* AI Code Inspector Removed - Moved to separate page */}

              {/* Submit Project */}
              <div className="upload-card">
                <h3>Submit New Project</h3>

                <form onSubmit={submitProject}>
                  {/* NOTE: Submission Type and ID are taken from Profile above */}

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
                            onClick={() => handleDownload(s.fileName)}
                          >
                            <Download size={14} /> View
                          </button>

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
