// src/components/Loginpage/Loginpage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Loginpage.css';

function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] =  useState('student'); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleLogin = (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Please enter email and password");
    return;
  }

  // Save role and email
  localStorage.setItem("role", role);
  localStorage.setItem("email", email);

  // Navigate to dashboard
  navigate("/dashboard");
};


  return (
    <div className="login-page-container">
      <div className="logo-container">
          <img src={'./src/assets/logo1.png'} alt="App Logo" className="login-logo" />
        </div>
      <div className="login-card">
        
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please enter your details to sign in.</p>
        
        {error && <p className="error-message">{error}</p>}

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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
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
            </select>
          </div>

          <button type="submit" className="btn-login">Login</button>
        </form>

        <p className="register-link-text">
          New User? <Link to="/Userprofile" className="register-link">Click here!</Link>
        </p>

        <p className="forgot-password-text">
          Forgot your password? <Link to="/forgot-password" className="forgot-password-link">Reset it here!</Link>
        </p>
      </div>
    </div>
  );
}

export default Loginpage;

