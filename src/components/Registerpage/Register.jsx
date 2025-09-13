// src/components/Registerpage/Register.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import logo from '../../assets/logo1.png';

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [facultyId, setFacultyId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    console.log("Registering user:", { fullName, email, role });
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    navigate('/dashboard');
  };

  return (
    <div className="register-page-container">
      {/* --- Logo is now outside the card --- */}
      <img src={logo} alt="PlagiX Logo" className="auth-logo" />

      <div className="register-card">
        <h2 className="register-title">Create Your Account</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleRegister} className="register-form">
          {/* ... rest of the form ... */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="form-input"/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input"/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input"/>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="form-input"/>
          </div>
          <div className="form-group radio-group">
            <label>Register as:</label>
            <div className="radio-options">
              <input type="radio" id="student" name="role" value="student" checked={role === "student"} onChange={() => setRole("student")} />
              <label htmlFor="student">Student</label>
              <input type="radio" id="teacher" name="role" value="teacher" checked={role === "teacher"} onChange={() => setRole("teacher")} />
              <label htmlFor="teacher">Teacher</label>
            </div>
          </div>
          {role === "teacher" && (
            <div className="form-group">
              <label htmlFor="facultyId">Faculty ID</label>
              <input type="text" id="facultyId" placeholder="Enter your faculty ID" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} required={role === "teacher"} className="form-input"/>
            </div>
          )}
          <button type="submit" className="btn-register">Register</button>
        </form>

        <p className="login-link-text">
          Already have an account? <Link to="/login" className="login-link">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

