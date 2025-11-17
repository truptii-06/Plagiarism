import React, { useState } from "react";
import "./Student.css";

// Import the shared components
import Reports from '../common/Reports.jsx';
import Settings from '../common/Setting.jsx';

const Student = () => {
  const [activeTab, setActiveTab] = useState('analysis'); 
  const [projects, setProjects] = useState([
    {
      title: "Research Paper Analysis",
      fileInfo: "document.pdf • Uploaded 2 days ago",
      plagiarismScore: 12,
      status: "✔ Completed",
      scoreLabel: "Excellent originality score",
      languages: "Python, JavaScript",
      startDate: "2025-09-20",
      endDate: "2025-09-25",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    languages: "",
    file: null,
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      title: formData.title,
      subject: formData.subject,
      languages: formData.languages,
      fileInfo: formData.file ? formData.file.name : "No file",
      startDate: formData.startDate,
      endDate: formData.endDate,
      plagiarismScore: 0,
      status: "In Progress",
      scoreLabel: "Pending plagiarism check",
    };
    setProjects([newProject, ...projects]);
    setShowForm(false);
    setFormData({ title: "", subject: "", languages: "", file: null, startDate: "", endDate: "" });
  };

  // Renders the main content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'analysis':
        return (
          <>
            <div className="stats">
              <div className="stat-card">
                <h3>Total Projects</h3>
                <p className="stat-value">{projects.length}</p>
                <span className="material-symbols-outlined">folder</span>
              </div>
              <div className="stat-card">
                <h3>Avg. Similarity</h3>
                <p className="stat-value green">18%</p>
                <span className="material-symbols-outlined">query_stats</span>
              </div>
              <div className="stat-card">
                <h3>This Month</h3>
                <p className="stat-value">8</p>
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
            </div>
            <div className="projects">
              <div className="projects-header">
                <h2>Your Projects</h2>
                <p>Manage and analyze your documents for plagiarism</p>
                <button className="create-btn" onClick={() => setShowForm(true)}>+ Create New Project</button>
              </div>
              {projects.map((project, index) => (
                <div className="project-card" key={index}>
                  <div className="project-status">{project.status}</div>
                  <h3>{project.title}</h3>
                  <p className="file-info">{project.fileInfo} • {project.startDate} to {project.endDate}</p>
                  {project.languages && <p>Languages: {project.languages}</p>}
                  <div className="plagiarism-score">
                    <p>Plagiarism Score <span className="green">{project.plagiarismScore}%</span></p>
                    <div className="progress-bar"><div className="progress" style={{ width: `${project.plagiarismScore}%` }}></div></div>
                    <span className="score-label">{project.scoreLabel}</span>
                  </div>
                  <div className="actions">
                    <button className="view-btn">View Report</button>
                    <button className="download-btn"><span className="material-symbols-outlined">download</span></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <div>Project Analysis</div>;
    }
  };

  return (
    <div className="student-dashboard">
      <div className="navbar">
        <h2 className="logo">PlagiX</h2>
        <div className="nav-centre"><span className="role">Student Dashboard</span></div>
        <div className="nav-right">
          <span className="welcome">Welcome back!</span>
          <div className="user-icon"><span className="material-symbols-outlined">account_circle</span></div>
          <span className="material-symbols-outlined settings">settings</span>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="sidebar">
          <h3>Dashboard</h3>
          <ul>
            <li className={activeTab === 'analysis' ? 'active' : ''} onClick={() => setActiveTab('analysis')}>Project Analysis</li>
            <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>Reports</li>
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</li>
          </ul>
        </div>
        <div className="main-content">
          {renderContent()}
        </div>
      </div>

      {showForm && (
        <div className="project-form-overlay">
          <form className="project-form" onSubmit={handleSubmit}>
            <h3>Create New Project</h3>
            <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleInputChange} required />
            <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleInputChange} required />
            <input type="text" name="languages" placeholder="Languages Used (e.g., Python, Java)" value={formData.languages} onChange={handleInputChange} />
            <label className="file-label">
              {formData.file ? formData.file.name : "Upload Project File"}
              <input type="file" name="file" onChange={handleInputChange} className="file-upload" />
            </label>
            <div className="date-fields">
              <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
              <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
            </div>
            <div className="form-buttons">
              <button type="submit">Add Project</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Student;
