// src/components/Loginpage/Loginpage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Loginpage.css';

function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] =  useState('student'); // Default role is student
  const [showPassword, setShowPassword] = useState(false); // New state for toggle
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      setEmail('');
      setPassword('');
      return;
    }

    // Allowed Admins with passwords
    const admins = {
      "sanika@gmail.com": "sanika5707",
      "vrushali@gmail.com": "vrushali111",
      "trupti@gmail.com": "trupti123"
    };

    if (role.toLowerCase() === "admin") {
      const correctPassword = admins[email.toLowerCase()];

      if (!correctPassword) {
        alert("❌ Sorry, you are not an admin");
        setEmail('');
        setPassword('');
        return;
      }

      if (password !== correctPassword) {
        alert("⚠️ Invalid admin password");
        setEmail('');
        setPassword('');
        return;
      }
    }

    // Save credentials
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);

    // Navigate
    navigate("/dashboard");
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please enter your details to sign in.</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* Password field with show/hide SVG */}
          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
              <span
                className="show-password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  // Eye closed SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238c1.14-1.08 1.72-2.262 1.72-2.262s-1.608-3.33-6.72-3.33c-1.4 0-2.66.453-3.688 1.184l.735.736c.828-.596 1.868-.92 2.953-.92 3.112 0 4.722 2.222 5.43 3.37-.257.317-.57.667-.933 1.025l.503.507z"/>
                    <path d="M9.5 8c0 .828-.672 1.5-1.5 1.5S6.5 8.828 6.5 8s.672-1.5 1.5-1.5 1.5.672 1.5 1.5z"/>
                    <path fillRule="evenodd" d="M3.646 3.646a.5.5 0 0 1 .708 0l8 8a.5.5 0 0 1-.708.708l-8-8a.5.5 0 0 1 0-.708z"/>
                  </svg>
                ) : (
                  // Eye open SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3.5-5.5-8-5.5S0 8 0 8s3.5 5.5 8 5.5S16 8 16 8zM8 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    <path d="M8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                  </svg>
                )}
              </span>
            </div>
          </div>

          {/* Role Selection Dropdown */}
          <div className="form-group">
            <label htmlFor="role">Login as</label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="form-input"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn-login">Login</button>
        </form>

        <p className="register-link-text">
          Don't have an account? <Link to="/register" className="register-link">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Loginpage;
