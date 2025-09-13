// src/components/Navbar/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Navbar.css'; // Import the stylesheet
import logo from '../../assets/logo1.png'; // Import your logo

function Navbar() {
  return (
    <header className="main-header">
      <nav className="navbar">
        {/* Logo on the left */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="PlagiX Logo" />
        </Link>

        {/* Navigation links in the center */}
        <ul className="nav-menu">
          <li><Link to="/why-plagix">Why PlagiX</Link></li>
          <li><Link to="/solutions">Solutions</Link></li>
          <li><Link to="/resources">Resources</Link></li>
          <li><Link to="/partners">Partners</Link></li>
        </ul>

        {/* Action links and buttons on the right */}
        <div className="nav-actions">
          <Link to="/support" className="nav-link">Support</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/register" className="btn-signup">Sign Up</Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;