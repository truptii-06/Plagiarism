import React from 'react';
import './Contact.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <>
      <div className="contact-page-container">
        <header className="contact-header">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you! Reach out with any questions, feedback, or inquiries.</p>
        </header>

        <section className="contact-form-section">
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
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

export default Contact;