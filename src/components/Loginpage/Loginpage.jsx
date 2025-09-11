import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Loginpage.css"; // Import CSS file
import logo from "../../assets/logo.png";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login clicked", { email, password });
    navigate("/"); // Redirect to homepage after login
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
         <img src={logo} alt="logo" />


        </div>
      </header>

      {/* Login Form */}
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
