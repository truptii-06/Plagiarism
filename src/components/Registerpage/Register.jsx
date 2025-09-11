import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import logo from "../../assets/logo.png";

function Registerpage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [facultyId, setFacultyId] = useState(""); // for teachers only
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // If Teacher role is selected, Faculty ID is mandatory
    if (role === "teacher") {
      if (!facultyId) {
        setError("Faculty ID is required for teacher registration.");
        return;
      }
      // TODO: verify Faculty ID against pre-approved teacher list
      setError("Teacher registration is currently restricted."); 
      return;
    }

    // Student registration logic
    console.log("Registered User:", { fullName, email, password, role });
    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
      </header>

      {/* Registration Form */}
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Create Your Account</h2>
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

          <form onSubmit={handleRegister} className="login-form">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="login-input"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input"
              required
            />
              {/* Faculty ID - only for teachers */}
            {role === "teacher" && (
              <input
                type="text"
                placeholder="Faculty ID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="login-input"
                required
              />
            )}

            {/* Role Selection */}
            <div style={{ textAlign: "left", margin: "10px 0" }}>
              <label style={{ marginRight: "10px" }}>
                <input
                  type="radio"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  style={{ marginRight: "5px" }}
                />
                Student
              </label>

              <label>
                <input
                  type="radio"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={() => setRole("teacher")}
                  style={{ marginRight: "5px" }}
                />
                Teacher
              </label>
            </div>

          

            <button type="submit" className="login-btn">
              Register
            </button>
          </form>

          <p className="register-text">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registerpage;
