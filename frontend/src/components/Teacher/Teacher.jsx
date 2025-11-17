import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Teacher.css'; // Assuming you will reuse/create a similar CSS file
// Switched from 'react-icons/fa' to 'lucide-react' to resolve compilation errors
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

// This component is now a layout, similar to Student.jsx
const Teacher = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Teacher logged out');
    navigate('/signup'); // Navigate to signup or login page
  };

  return (
    <div className="teacher-dashboard">
      {' '}
      {/* Using teacher-dashboard CSS class */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>PlagiX</h3>
          <span className="role-badge">Teacher</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/teacher/dashboard"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <LayoutDashboard size={20} /> {/* Changed from FaTachometerAlt */}
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/teacher/submissions"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <LayoutDashboard size={20} /> {/* Changed from FaTachometerAlt */}
            <span>Submissions</span>
          </NavLink>
          <NavLink
            to="/teacher/my-classes"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <BookOpen size={20} /> {/* Changed from FaBook */}
            <span>My Classes</span>
          </NavLink>
          <NavLink
            to="/teacher/reports"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <FileText size={20} /> {/* Changed from FaFileAlt */}
            <span>Reports</span>
          </NavLink>
          <NavLink
            to="/teacher/settings"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <Settings size={20} /> {/* Changed from FaCog */}
            <span>Settings</span>
          </NavLink>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <LogOut size={20} /> {/* Changed from FaSignOutAlt */}
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {/* Top navbar for teacher dashboard */}
        <div className="navbar">
          {/* This navbar was part of your original Teacher.jsx logic.
              You can keep it or remove it if the sidebar is enough. */}
          <h2 className="logo">PlagiX</h2>
          <div className="nav-centre">
            <span className="role">Teacher Dashboard</span>
          </div>
          <div className="nav-right">
            <span className="welcome">Welcome back!</span>
            {/* You may need to import the user icon, e.g., from lucide-react */}
            <div className="user-icon">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
          </div>
        </div>

        {/* Main content area for nested routes */}
        <div className="dashboard-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Teacher;
