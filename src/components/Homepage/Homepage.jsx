import React, { useState } from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";

// Import images from assets
import logo from "../../assets/logo1.png";
import laptop from "../../assets/laptop.png";
import hero1 from "../../assets/hero1.jpg";
import hero2 from "../../assets/hero2.jpg";
import hero3 from "../../assets/hero3.jpg";

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="homepage">
      {/* Navbar */}
      <header className="navbar">
        

        {/* Hamburger Icon for Mobile */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-buttons">
            <Link to="/login">
              <button className="btn-primary">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary">Sign Up</button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="title">
            AI-Resistant{" "}
            <span className="highlight">
              Plagiarism Detection for Projects & Code!
            </span>
          </h1>
          <p className="subtitle">
            Check plagiarism in reports, detect AI-generated code, and support
            multiple Indian languages.
          </p>
          <Link to="/product/clarity" className="btn-discover">Discover More</Link>
          
        </div>
        <div className="hero-right">
          <img
            src={laptop}
            alt="Computer illustration"
            className="illustration"
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="content">
        <div className="content-block">
          <img
            src={hero1}
            alt="collaboration"
            className="content-image"
          />
          <div className="content-text">
            <h2>The difference between originality and AI</h2>
            <p>
              PlagiX goes beyond traditional plagiarism checkers by detecting
              not only copied text but also AI-generated content. Whether it's
              academic writing, coding projects, or research papers, our
              platform ensures you know the true originality of the work.
            </p>
            <a href="#">Explore our AI resources →</a>
          </div>
        </div>

        <div className="content-block reverse">
          <img
            src={hero2}
            alt="student writing"
            className="content-image"
          />
          <div className="content-text">
            <h2>Empower students to do their best work</h2>
            <p>
              With PlagiX, students can confidently submit assignments and
              projects knowing they'll be checked against a vast database,
              multiple Indian languages, and even AI-generated sources.
              Educators gain access to clear reports, helping them guide
              students towards better academic integrity and skill development.
            </p>
            <a href="#">Learn about feedback tools →</a>
          </div>
        </div>

        <div className="content-block">
          <img
            src={hero3}
            alt="collaboration"
            className="content-image"
          />
          <div className="content-text">
            <h2>Check Plagiarism in Multiple Languages</h2>
            <p>
              PlagiX supports plagiarism detection in most Indian languages,
              making it easy for students and educators to ensure originality
              across Hindi, Marathi, Tamil, Bengali, Telugu, and more.
            </p>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default Homepage;
