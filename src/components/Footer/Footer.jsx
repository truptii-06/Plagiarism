// src/components/Footer/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Products</h4>
          <ul>
            <li><Link to="/products/originality">Originality</Link></li>
            <li><Link to="/products/similarity">Similarity</Link></li>
            <li><Link to="/products/feedback-studio">Feedback Studio</Link></li>
            <li><Link to="/products/revision-assistant">Revision Assistant</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Solutions</h4>
          <ul>
            <li><Link to="/solutions/higher-education">Higher Education</Link></li>
            <li><Link to="/solutions/k-12">K-12</Link></li>
            <li><Link to="/solutions/research">Research & Publishing</Link></li>
            <li><Link to="/solutions/partnerships">Partnerships</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>About</h4>
          <ul>
            <li><Link to="/about/company">Company</Link></li>
            <li><Link to="/about/careers">Careers</Link></li>
            <li><Link to="/about/press">Press</Link></li>
            <li><Link to="/about/contact-us">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/resources/blog">Blog</Link></li>
            <li><Link to="/resources/case-studies">Case Studies</Link></li>
            <li><Link to="/resources/webinars">Webinars</Link></li>
            <li><Link to="/resources/support">Support</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PlagiX. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
