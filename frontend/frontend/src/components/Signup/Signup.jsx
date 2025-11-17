import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Username validation
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(value)) {
      setUsernameError(
        "Username must have 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long."
      );
    } else {
      setUsernameError("");
    }
  };

  // Password validation
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match!");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError("Passwords do not match!");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (usernameError || passwordError) {
    alert("Please fix errors before submitting.");
    return;
  }

  const url = role === "student"
    ? "http://localhost:5000/api/register/student"
    : "http://localhost:5000/api/register/teacher";

  const body =
    role === "student"
      ? {
          firstName: document.querySelector("input[placeholder='First Name *']").value,
          lastName: document.querySelector("input[placeholder='Last Name *']").value,
          username,
          password,
          email: document.querySelector("input[type='email']").value,
          phone: document.querySelector("input[placeholder='Phone *']").value,
        }
      : {
          teacherName: document.querySelector("input[placeholder='Teacher Name *']").value,
          organization: document.querySelector("input[placeholder='Organization *']").value,
          username,
          password,
          email: document.querySelector("input[type='email']").value,
          phone: document.querySelector("input[placeholder='Phone *']").value,
        };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registration successful!");
      navigate("/");
    } else {
      alert(data.error || data.message || "Registration failed.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
};



  return (
    <div className="signup-container">
      <div className="logo1">
        <h3>PlagiX</h3>
      </div>
      {/* Left Section */}
      <div className="left-section">
        <h2>Welcome To PlagiX</h2>
        <p>Your one-stop solution for plagiarism detection and prevention.</p>
        <button className="login-btn">
          <Link to="/">Login</Link>
        </button>
      </div>

      {/* Right Section */}
      <div className="right-section">
        {/* Toggle */}
        <div className="toggle-buttons">
          <button
            type="button"
            className={`toggle-btn ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            type="button"
            className={`toggle-btn ${role === "teacher" ? "active" : ""}`}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </button>
        </div>

        {/* Form */}
        <h2 className="form-title">
          {role === "student"
            ? "Create Account as an Student"
            : "Create Account as a Teacher"}
        </h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          {role === "student" ? (
            <>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Username *"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              {usernameError && (
                <p className="error-message">{usernameError} </p>
              )}

              <div className="form-row">
                <input
                  type="password"
                  placeholder="Password *"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password *"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}

              <div className="form-row">
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Phone *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Teacher Name *"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Organization *"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Username *"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              {usernameError && (
                <p className="error-message">{usernameError}</p>
              )}

              <div className="form-row">
                <input
                  type="password"
                  placeholder="Password *"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />

                <input
                  type="password"
                  placeholder="Confirm Password *"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}

              <div className="form-row">
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Phone *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
