// src/components/Registerpage/Registerpage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Register.css"; // Make sure this CSS file is linked

function Registerpage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [facultyId, setFacultyId] = useState(""); // For teachers only
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // You would typically send this data to a backend API
    // For now, let's just log it and simulate success
    console.log({ fullName, email, password, role, facultyId });

    // Simulate API call success
    try {
      // Replace with your actual API call
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ fullName, email, password, role, facultyId: role === 'teacher' ? facultyId : undefined })
      // });

      // const data = await response.json();

      // if (response.ok) {
        navigate('/login'); // Navigate to login on successful registration
      // } else {
      //   setError(data.message || 'Registration failed.');
      // }

    } catch (apiError) {
      setError('An error occurred during registration.');
      console.error('Registration API error:', apiError);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        <h2 className="register-title">Create Your Account</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="form-input"
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group radio-group">
            <label>Register as:</label>
            <div className="radio-options">
              <input
                type="radio"
                id="student"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => { setRole("student"); setFacultyId(""); }}
              />
              <label htmlFor="student">Student</label>

              <input
                type="radio"
                id="teacher"
                name="role"
                value="teacher"
                checked={role === "teacher"}
                onChange={() => setRole("teacher")}
              />
              <label htmlFor="teacher">Teacher</label>
            </div>
          </div>

          {role === "teacher" && (
            <div className="form-group">
              <label htmlFor="facultyId">Faculty ID</label>
              <input
                type="text"
                id="facultyId"
                placeholder="Enter your faculty ID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                required={role === "teacher"}
                className="form-input"
              />
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

export default Registerpage;