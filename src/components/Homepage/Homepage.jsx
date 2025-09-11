import React from 'react'
import { useState } from 'react';
import './Homepage.css';

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img
            src="./src/assets/logo.png"
            alt="Logo"
          />
        </div>

        <nav className="nav-links">
          <a href="#">Products</a>
          <a href="#">Solutions</a>
          <a href="#">Resources</a>
          <a href="#">About</a>
          <a href="#">Pricing</a>
        </nav>

        <div className="nav-buttons">
          <button className="btn-primary">Login</button>
          <button className="btn-dark">Get a Demo</button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="#">Products</a>
          <a href="#">Solutions</a>
          <a href="#">Resources</a>
          <a href="#">About</a>
          <a href="#">Pricing</a>
          <div className="mobile-buttons">
            <button className="btn-primary">Login</button>
            <button className="btn-dark">Get a Demo</button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Cultivate original thinking. Build a better writer.
          </h1>
          <p className="hero-subtitle">
            With a clear path from originality to improved writing, Turnitin
            offers solutions that promote academic excellence.
          </p>
          <div className="hero-actions">
            <button className="btn-dark">Get a Demo</button>
            <button className="btn-outline">Watch the Video</button>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="content">
        <div className="content-block">
          <img
            src="https://placehold.co/600x400"
            alt="collaboration"
            className="content-image"
          />
          <div className="content-text">
            <h2>The difference between originality and AI</h2>
            <p>
              Turnitin is constantly building, learning, and developing new
              technology to ensure trust in originality checks.
            </p>
            <a href="#">Explore our AI resources →</a>
          </div>
        </div>

        <div className="content-block reverse">
          <img
            src="https://placehold.co/600x400"
            alt="student writing"
            className="content-image"
          />
          <div className="content-text">
            <h2>Empower students to do their best work</h2>
            <p>
              Through rich, personalized feedback, Turnitin helps students
              develop skills for success in academics and beyond.
            </p>
            <a href="#">Learn about feedback tools →</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-columns">
          <div>
            <h3>Products</h3>
            <ul>
              <li><a href="#">Originality</a></li>
              <li><a href="#">Similarity</a></li>
              <li><a href="#">Feedback Studio</a></li>
              <li><a href="#">Revision Assistant</a></li>
            </ul>
          </div>
          <div>
            <h3>Solutions</h3>
            <ul>
              <li><a href="#">Higher Education</a></li>
              <li><a href="#">K-12</a></li>
              <li><a href="#">Research & Publishing</a></li>
              <li><a href="#">Partnerships</a></li>
            </ul>
          </div>
          <div>
            <h3>About</h3>
            <ul>
              <li><a href="#">Company</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">Webinars</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
        </div>
        <p className="footer-copy">© 2023 Turnitin, LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Homepage
