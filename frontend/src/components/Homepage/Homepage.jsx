import React, { useState } from 'react';
import './Homepage.css';
import { Search, Globe, BarChart } from 'lucide-react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Import all image assets
import vrushaliImage from '../../assets/vrushali.jpg';
import sanikaImage from '../../assets/sanika.jpg';
import truptiImage from '../../assets/trupti.jpg';
import aiCardImage from '../../assets/AI-card.png';
import multilingualImage from '../../assets/multilingual.jpg';

const Homepage = () => {
  const navigate = useNavigate();

  // Login states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('');

  // Contact Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // =====================================================
  // ⭐ FIXED LOGIN FUNCTION (ONLY CHANGE YOU NEEDED)
  // =====================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginRole) {
      alert("Please select a role.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username: loginUsername,
          password: loginPassword,
          role: loginRole,
        }
      );

      // Save token + user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("studentId", response.data.user.id);  // ADD THIS

      // ⭐ VERY IMPORTANT FIX → Store studentId
      if (response.data.user.role === "student") {
        localStorage.setItem("studentId", response.data.user.studentId);
      }

      alert("Login successful!");

      // Redirect
      if (response.data.user.role === "student") {
        navigate("/student");
      } else if (response.data.user.role === "teacher") {
        navigate("/teacher");
      } else {
        alert("Invalid role received!");
      }

    } catch (err) {
      alert(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  // Contact Form Submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");

    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <>
      <div className="page">
        <div className="bg-page">
          <div className="main-page">
            {/* ================= NAVBAR ================= */}
            <div className="nav">
              <h1 className="logo">PlagiX</h1>
              <div className="nav-links">
                <a href="#about" className="about">About</a>
                <a href="#services" className="services">Services</a>
                <a href="#contact" className="contact">Contact</a>
                <Link to="/signup" className="sign-up-btn">Sign Up</Link>
              </div>
            </div>

            {/* ================= HERO SECTION ================= */}
            <div className="content">
              <div className="left-content">
                <h1 className="title">Welcome to PlagiX</h1>
                <p className="subtitle">Your Ultimate Plagiarism Detection Solution</p>
                <p className="description">
                  “PlagiX is an AI-resistant plagiarism checker built for the future of education.
                  It goes beyond text comparison, bringing deep code analysis, smart detection of
                  AI-generated content, and real-time feedback for students and teachers.”
                </p>
                <Link to="/signup" className="get-started">Get Started</Link>
              </div>

              {/* ================= LOGIN BOX ================= */}
              <div className="right-content">
                <div className="loginpage">
                  <h2>Login to PlagiX</h2>

                  <form className="login-form" onSubmit={handleLogin}>
                    <input
                      type="text"
                      placeholder="Username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                    />

                    <input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />

                    <div className="dropdown">
                      <select
                        id="role"
                        value={loginRole}
                        onChange={(e) => setLoginRole(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select Role</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <button type="submit" className="login-btn">Login</button>

                    <div className="remember-me">
                      <input type="checkbox" id="remember" />
                      <label htmlFor="remember">Remember Me</label>
                    </div>

                    <div className="forgot-password">
                      <a href="/forgot-password">Forgot Password?</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* END HERO */}
          </div>
        </div>
      </div>

      {/* ================= SERVICES SECTION ================= */}
      <section className="our-services" id="services">
        <h2 className="service-title">Our Services</h2>
        <p className="service-description">
          Discover the range of services we offer to enhance your educational experience.
        </p>

        <div className="service-cards">
          <div className="service-card">
            <Search size={48} color="#4A90E2" />
            <h3>Comprehensive Plagiarism Detection</h3>
            <p>
              Our advanced algorithms scan academic papers, research reports, and code with high accuracy.
            </p>
          </div>

          <div className="service-card">
            <Globe size={48} color="#4A90E2" />
            <h3>Multilingual Support</h3>
            <p>
              PlagiX works across multiple languages, removing barriers in plagiarism checking.
            </p>
          </div>

          <div className="service-card">
            <BarChart size={48} color="#4A90E2" />
            <h3>Detailed Reporting</h3>
            <p>
              Get scores, highlighted matches, and insights to improve writing integrity.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="why-choose-us" id="about">
        <h2 className="section-title">Why Choose Us</h2>

        <div className="card">
          <div className="card-text">
            <h3>
              Advance learning with an AI writing detection solution built for educators
            </h3>
            <p>
              PlagiX identifies AI-generated content to maintain academic integrity.
            </p>
          </div>
          <div className="card-image">
            <img src={aiCardImage} alt="AI resistant" />
          </div>
        </div>

        <div className="card reverse">
          <div className="card-image">
            <img src={multilingualImage} alt="Language barriers" />
          </div>
          <div className="card-text">
            <h3>Break Language Barriers</h3>
            <p>
              Detect copied content effortlessly across different languages.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TEAM SECTION ================= */}
      <section className="our-team">
        <h2 className="team-title">Meet Our Team</h2>

        <div className="team-cards">
          <div className="team-member-card">
            <img src={vrushaliImage} alt="Vrushali" className="team-profile-pic" />
            <h3>Vrushali</h3>
            <p className="team-role">UI/UX Designer</p>
            <div className="team-socials">
              <a href="https://www.linkedin.com/in/vrushali-gawai01/" target="_blank" rel="noreferrer">
                <FaLinkedinIn />
              </a>
              <a href="#"><FaTwitter /></a>
              <a href="https://www.instagram.com/vrushali._01/" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="team-member-card">
            <img src={sanikaImage} alt="Sanika" className="team-profile-pic" />
            <h3>Sanika</h3>
            <p className="team-role">Manager</p>
            <div className="team-socials">
              <a href="https://www.linkedin.com/in/sanika-deshmukh25/" target="_blank" rel="noreferrer">
                <FaLinkedinIn />
              </a>
              <a href="#"><FaTwitter /></a>
              <a href="https://www.instagram.com/softserenity_25/" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="team-member-card">
            <img src={truptiImage} alt="Trupti" className="team-profile-pic" />
            <h3>Trupti</h3>
            <p className="team-role">Developer</p>
            <div className="team-socials">
              <a href="https://www.linkedin.com/in/truptii/" target="_blank" rel="noreferrer">
                <FaLinkedinIn />
              </a>
              <a href="#"><FaTwitter /></a>
              <a href="https://www.instagram.com/its.truptii06/" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LET'S CONNECT SECTION ================= */}
      <section className="lets-connect" id="contact">
        <h2 className="section-title">Let's Connect</h2>
        <p className="section-subtitle">
          Have questions or want to know more? Send us a message!
        </p>

        <form className="contact-form" onSubmit={handleContactSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>PlagiX</h2>
            <p>Your ultimate plagiarism detection solution</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Email: support@plagix.com</p>
            <p>Phone: +91 1234567890</p>

            <div className="footer-socials">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedinIn /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 PlagiX. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Homepage;
