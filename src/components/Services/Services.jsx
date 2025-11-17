import React from 'react';
import './Services.css';
import { Search, Globe, BarChart } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const FeaturesServices = () => {
  return (
    <>
      <div className="features-services-page-container">
        <header className="features-services-header">
          <h1>Our Features & Services</h1>
          <p>Explore the powerful features that make PlagiX a leading plagiarism detection solution.</p>
        </header>

        <section className="features-services-content">
          {/* Services Cards Section */}
          <div className="service-cards">
            <div className="service-card">
              <Search size={48} color="#4A90E2" />
              <h3>Comprehensive Plagiarism Detection</h3>
              <p>Our advanced algorithms scan academic papers, research reports, and code 
                to identify copied or closely matched content with high accuracy.</p>
            </div>
            <div className="service-card">
              <Globe size={48} color="#4A90E2" />
              <h3>Multilingual Support</h3>
              <p>PlagiX works across multiple languages, making it easier for global 
                users to check originality without language barriers.</p>
            </div>
            <div className="service-card">
              <BarChart size={48} color="#4A90E2" />
              <h3>Detailed Reporting</h3>
              <p>Get clear originality scores, highlighted matches, and easy-to-understand 
                insights that help improve writing and coding integrity.</p>
            </div>
          </div>
        
          {/* Features Section */}
          <div className="card">
            <div className="card-text">
              <h3>Advance learning with an AI writing detection solution built for educators</h3>
              <p>PlagiX is engineered to identify AI-generated content, ensuring that 
                students submit original work and maintain academic integrity.</p>
            </div>
            <div className="card-image">
              <img src="./src/assets/AI-card.png" alt="AI resistant" />
            </div>
          </div>

          <div className="card reverse">
            <div className="card-image">
              <img src="./src/assets/multilingual.jpg" alt="Language barriers" />
            </div>
            <div className="card-text">
              <h3>Break Language Barriers</h3>
              <p>Detect copied content effortlessly across different languages, making 
                plagiarism checks easy for Indian users.</p>
            </div>
          </div>

          {/* New Section: Accuracy & Cloud-Based */}
          <div className="new-features-section">
            <div className="feature-item">
              <h3>High Accuracy Detection</h3>
              <p>Our sophisticated algorithms provide a high degree of accuracy,
                identifying even subtle forms of plagiarism by comparing against
                a vast database of academic and online sources.
              </p>
            </div>
            <div className="feature-item">
              <h3>Secure & Cloud-Based</h3>
              <p>PlagiX operates on a secure, cloud-based platform, allowing you
                to access your reports and submissions from anywhere, at any time,
                without the need for local software installations.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer from Homepage for consistent navigation */}
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
              <li><Link to="/features-services">Features & Services</Link></li>
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

export default FeaturesServices;