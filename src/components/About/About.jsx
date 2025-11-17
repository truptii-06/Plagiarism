import React from 'react';
import './About.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

// Import the placeholder images for your team members
import vrushaliImage from "../../assets/vrushali.jpg";
import sanikaImage from "../../assets/sanika.jpg";
import truptiImage from "../../assets/trupti.jpg";


const About = () => {
  return (
    <>
      <div className="about-page-container">
        <header className="about-header">
          <h1>About PlagiX</h1>
          <p>Our commitment to authentic knowledge and academic integrity.</p>
        </header>

        <section className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              PlagiX is an AI-resistant plagiarism checker built for the future of education. We go beyond simple text comparison to provide a comprehensive solution for students and educators. Our mission is to promote originality, transparency, and trust in academic and creative work.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Vision</h2>
            <p>
              We envision a world where intellectual honesty is at the forefront of every submission. PlagiX aims to be the leading tool for ensuring authentic and original content, empowering learners, educators, and administrators with the technology they need to uphold the highest standards of integrity.
            </p>
          </div>

          {/* New Team Section */}
          <div className="about-section team">
            <h2>Our Team</h2>
            <div className="team-members">
              <div className="team-member-card">
                <img src={vrushaliImage} alt="Vrushali" />
                <h3>Vrushali</h3>
                <p>UI/UX Designer</p>
                <div className="team-socials">
                  <a href="https://www.linkedin.com/in/vrushali-gawai01/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
                  <a href="#" aria-label="Twitter"><FaTwitter /></a>
                  <a href="https://www.instagram.com/vrushali._01/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                </div>
              </div>
              <div className="team-member-card">
                <img src={sanikaImage} alt="Sanika" />
                <h3>Sanika</h3>
                <p>Manager</p>
                <div className="team-socials">
                  <a href="https://www.linkedin.com/in/sanika-deshmukh25/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
                  <a href="#" aria-label="Twitter"><FaTwitter /></a>
                  <a href="https://www.instagram.com/softserenity_25/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                </div>
              </div>
              <div className="team-member-card">
                <img src={truptiImage} alt="Trupti" />
                <h3>Trupti</h3>
                <p>Developer</p>
                <div className="team-socials">
                  <a href="https://www.linkedin.com/in/truptii/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
                  <a href="https://x.com/truptii_06" aria-label="Twitter"><FaTwitter /></a>
                  <a href="https://www.instagram.com/its.truptii06/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 🔹 Footer */}
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
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
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
          <p>&copy; 2025 PlagiX. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default About;