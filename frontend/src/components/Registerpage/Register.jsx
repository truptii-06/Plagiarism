// src/components/Registerpage/Register.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import logo from '../../assets/logo1.png';

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    facultyId: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { fullName, email, password, confirmPassword, role, facultyId } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onRoleChange = e => setFormData({ ...formData, role: e.target.value });
  const onOTPChange = e => setFormData({ ...formData, OTP: e.target.value });
  const { OTP } = formData;
  const { studentId } = formData;
  const onStudentIdChange = e => setFormData({ ...formData, studentId: e.target.value });
  



  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const newUser = { fullName, email, password, role };
      if (role === 'teacher') {
        newUser.facultyId = facultyId;
      }

      // This is the API call
      const res = await axios.post('http://localhost:5000/api/auth/register', newUser);

      // Assuming the backend sends back a token
      console.log('Registration successful:', res.data);

      // Save the token to local storage
      localStorage.setItem('token', res.data.token);
      
      // Redirect to the dashboard
      navigate('/dashboard');

    } catch (err) {
      // Set error message from backend response if it exists
      setError(err.response?.data?.msg || 'An error occurred during registration.');
      console.error(err.response?.data);
    }
  };

  return (
    <div className="register-page-container">
      <img src={logo} alt="PlagiX Logo" className="auth-logo" />

      <div className="register-card">
        <h2 className="register-title">Create Your Account</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName"
              placeholder="Enter your full name" 
              value={fullName} 
              onChange={onChange} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="student-id">Student Id</label>
            <input 
              type="text" 
              id="student-id"
              name="studentId"
              placeholder="Enter your student ID" 
              value={studentId} 
              onChange={onChange} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder="Enter your email" 
              value={email} 
              onChange={onChange} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="OTP">OTP</label>
            <input 
              type="text" 
              id="OTP" 
              name="OTP"
              placeholder="Enter the OTP" 
              value={OTP} 
              onChange={onChange} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              placeholder="Create a password" 
              value={password} 
              onChange={onChange} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              placeholder="Confirm your password" 
              value={confirmPassword} 
              onChange={onChange} 
              required 
              className="form-input"
            />
          </div>
          
          
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

