import React, { useState } from 'react';
import './Teacher.css';

// Import the new shared components
import Settings from '../common/Setting.jsx';
import MyClasses from '../common/MyClasses.jsx';
import Reports from '../common/Reports.jsx';

const Teacher = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([
    { id: 1, studentName: 'Rohan Verma', title: 'Quantum Computing Research', fileInfo: 'document.pdf • Submitted 1 day ago', plagiarismScore: 8, status: 'Graded' },
    { id: 2, studentName: 'Priya Sharma', title: 'Machine Learning in Healthcare', fileInfo: 'report.docx • Submitted 3 days ago', plagiarismScore: 22, status: 'Needs Review' },
    { id: 3, studentName: 'Amit Singh', title: 'Blockchain Technology Analysis', fileInfo: 'analysis.pdf • Submitted 5 days ago', plagiarismScore: 15, status: 'Needs Review' },
  ]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  
  const pendingReviewCount = submissions.filter(s => s.status === 'Needs Review').length;

  const handleViewReport = (submission) => setSelectedSubmission(submission);
  const handleCloseModal = () => { setSelectedSubmission(null); setFeedback(''); };
  const handleSendFeedback = () => {
    if (!feedback) return alert('Please enter your feedback.');
    alert(`Feedback sent for "${selectedSubmission.title}"!`);
    handleCloseModal();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'submissions':
        return (
          <>
            <div className="stats">
              <div className="stat-card">
                <h3>Pending Reviews</h3>
                <p className="stat-value orange">{pendingReviewCount}</p>
                <span className="material-symbols-outlined">hourglass_top</span>
              </div>
              <div className="stat-card">
                <h3>Avg. Similarity</h3>
                <p className="stat-value green">16%</p>
                <span className="material-symbols-outlined">query_stats</span>
              </div>
              <div className="stat-card">
                <h3>Total Submissions</h3>
                <p className="stat-value">{submissions.length}</p>
                <span className="material-symbols-outlined">folder</span>
              </div>
            </div>
            <div className="submissions">
              <div className="submissions-header"><h2>Student Submissions</h2><p>Review and grade documents for plagiarism</p></div>
              {submissions.map((sub) => (
                <div className="submission-card" key={sub.id}>
                  <div className={`submission-status ${sub.status === 'Needs Review' ? 'needs-review' : ''}`}>{sub.status}</div>
                  <h3>{sub.title}</h3>
                  <p className="student-info"><strong>Student:</strong> {sub.studentName} • {sub.fileInfo}</p>
                  <div className="plagiarism-score">
                    <p>Plagiarism Score <span className={sub.plagiarismScore > 20 ? 'red' : 'green'}>{sub.plagiarismScore}%</span></p>
                    <div className="progress-bar"><div className="progress" style={{ width: `${sub.plagiarismScore}%`, backgroundColor: sub.plagiarismScore > 20 ? '#e74c3c' : '#2ecc71' }}></div></div>
                  </div>
                  <div className="actions"><button className="view-btn" onClick={() => handleViewReport(sub)}>View Report & Grade</button></div>
                </div>
              ))}
            </div>
          </>
        );
      case 'my-classes':
        return <MyClasses />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <div>Submissions Content</div>;
    }
  };

  return (
    <div className="teacher-dashboard">
      <div className="navbar">
        <h2 className="logo">PlagiX</h2>
        <div className="nav-centre"><span className="role">Teacher Dashboard</span></div>
        <div className="nav-right">
          <span className="welcome">Welcome back!</span>
          <div className="user-icon"><span className="material-symbols-outlined">account_circle</span></div>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="sidebar">
          <h3>Dashboard</h3>
          <ul>
            <li className={activeTab === 'submissions' ? 'active' : ''} onClick={() => setActiveTab('submissions')}>Submissions</li>
            <li className={activeTab === 'my-classes' ? 'active' : ''} onClick={() => setActiveTab('my-classes')}>My Classes</li>
            <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>Reports</li>
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</li>
          </ul>
        </div>
        <div className="main-content">{renderContent()}</div>
      </div>

      {selectedSubmission && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <h3>Report for "{selectedSubmission.title}"</h3>
            <p><strong>Student:</strong> {selectedSubmission.studentName}</p>
            <p><strong>Plagiarism Score:</strong> {selectedSubmission.plagiarismScore}%</p>
            <textarea placeholder="Provide feedback or grading notes here..." value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
            <div className="modal-buttons">
              <button onClick={handleSendFeedback}>Send Feedback</button>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teacher;