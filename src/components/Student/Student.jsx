import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Student.css';
// Switched from 'react-icons/fa' to 'lucide-react' to resolve compilation errors
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

const Student = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens)
    console.log('User logged out');
    navigate('/signup'); // Navigate to signup or login page
  };

  return (
    <div className="student-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>PlagiX</h3>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <LayoutDashboard size={20} /> {/* Changed from FaTachometerAlt */}
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/student/my-classes"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <BookOpen size={20} /> {/* Changed from FaBook */}
            <span>My Classes</span>
          </NavLink>
          <NavLink
            to="/student/reports"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <FileText size={20} /> {/* Changed from FaFileAlt */}
            <span>Reports</span>
          </NavLink>
          <NavLink
            to="/student/settings"
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
            <span className="role">Student Dashboard</span>
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

export default Student;
