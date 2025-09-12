import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Loginpage.css";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Store email and role in localStorage
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    // Redirect based on role
    if (role === "student") {
      navigate("/student-dashboard");
    } else if (role === "teacher") {
      navigate("/teacher-dashboard");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <img src="../../assets/logo.png" alt="Logo" />
        </div>
      </header>

      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Welcome Back</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />

            {/* Role Selector */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="login-input"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <p className="register-text">
            Not registered?{" "}
            <Link to="/register" className="register-link">
              Click here to Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
