// src/components/Loginpage/Loginpage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Loginpage.css'; // Make sure to link the CSS file

function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Simulate a successful login for now
    console.log('Logging in with:', { email, password });
    
    // In a real app, you would make an API call here.
    // try {
    //   const response = await fetch('/api/login', { ... });
    //   if (response.ok) {
         navigate('/'); // Redirect to homepage on successful login
    //   } else {
    //     const data = await response.json();
    //     setError(data.message || 'Invalid email or password.');
    //   }
    // } catch (apiError) {
    //   setError('An error occurred. Please try again.');
    // }
  };

  return (
    <div className="login-page-container">
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
