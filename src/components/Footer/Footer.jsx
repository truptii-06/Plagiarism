// src/components/Footer/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Partners</h4>
          <ul>
            <li><Link to="/partners/institutions">Institutions</Link></li>
            <li><Link to="/partners/technology">Technology</Link></li>
            <li><Link to="/partners/resellers">Resellers</Link></li>
            <li><Link to="/partners/become-a-partner">Become a Partner</Link></li>
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