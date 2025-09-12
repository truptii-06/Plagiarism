import React from "react";
import "./Homepage.css"; // ensure this image is in src folder
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <img
            src="./src/assets/logo1.png" 
            alt="Logo"
          />
          
        </div>
        <nav className="menu">
          <Link to="/login">
            <button className="btn-primary">Login</button>
<<<<<<< HEAD
          </Link>
          <Link to="/register">
            <button className="btn-primary">Sign Up</button>
=======
>>>>>>> 25c0af15f60c820f9047a70e158f3de0a88ca35f
          </Link>
        </nav>
      </header>
<<<<<<< HEAD
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
      {/* Hero */}
=======

      {/* Hero Section */}
>>>>>>> 25c0af15f60c820f9047a70e158f3de0a88ca35f
      <section className="hero">
        {/* Left Content */}
        <div className="hero-left">
          <h1 className="title">
            AI-Resistant <span className="highlight">Plagiarism Detection for Projects & Code!</span>
          </h1>
          <p className="subtitle">
            Check plagiarism in reports, detect AI-generated code, and support multiple Indian languages.
          </p>
          <button className="btn-start">Get Started</button>
        </div>

        {/* Right Image */}
        <div className="hero-right">
          <img
            src={'./src/assets/laptop.png'} 
            alt="Computer illustration"
            className="illustration"
          />
        </div>
      </section>

       <section className="content">
        <div className="content-block">
           <img
            src="./src/assets/hero1.jpg"
            alt="collaboration"
            className="content-image"
          />
          <div className="content-text">
            <h2>The difference between originality and AI</h2>
            <p>
             PlagiX goes beyond traditional plagiarism checkers by detecting not 
             only copied text but also AI-generated content. Whether it's academic writing, 
             coding projects, or research papers, our platform ensures you know the true originality of the work.
            </p>
            <a href="#">Explore our AI resources →</a>
          </div>
        </div>

        <div className="content-block reverse">
          <img
            src="src/assets/hero2.jpg"
            alt="student writing"
            className="content-image"
          />
          <div className="content-text">
            <h2>Empower students to do their best work</h2>
            <p>
              With PlagiX, students can confidently submit assignments and projects 
              knowing they'll be checked against a vast database, multiple Indian languages, 
              and even AI-generated sources. Educators gain access to clear reports, 
              helping them guide students towards better academic integrity and skill development.
            </p>
            <a href="#">Learn about feedback tools →</a>
          </div>
        </div>

        <div className="content-block">
          <img
            src="./src/assets/hero3.jpg"
            alt="collaboration"
            className="content-image"
          />
          <div className="content-text">
            <h2>Check Plagiarism in Multiple Languages</h2>
            <p>
             PlagiX supports plagiarism detection in most Indian languages, making it easy for students and educators to ensure originality across Hindi, Marathi, Tamil, Bengali, Telugu, and more.
            </p>
            
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
       
       </footer>


    </div>
  );
};

export default Homepage;

