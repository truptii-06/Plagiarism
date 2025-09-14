// src/components/WhyPlagixPage/WhyPlagixPage.jsx

import React from 'react';
import './WhyPlagixPage.css';

function WhyPlagixPage() {
  return (
    <div className="generic-page-container">
      <header className="page-hero">
        <h1>Why PlagiX?</h1>
        <p>Upholding academic integrity in the age of AI and digital learning.</p>
      </header>
      <main className="page-main-content">
        <section className="page-section">
          <h2>Our Mission</h2>
          <p>
            At PlagiX, our mission is to empower educators and institutions to foster a culture of academic honesty. We provide advanced, intuitive tools that not only detect plagiarism and AI-generated content but also serve as a foundation for teaching students the value of original thought and proper citation.
          </p>
        </section>
        <section className="page-section card-layout">
          <div className="info-card">
            <h3>AI-Resistant Detection</h3>
            <p>Our cutting-edge algorithms are continuously updated to stay ahead of emerging AI writing technologies, ensuring you get the most reliable results.</p>
          </div>
          <div className="info-card">
            <h3>Designed for Educators</h3>
            <p>From seamless LMS integration to actionable feedback tools, our platform is built to fit into your existing workflow and save you valuable time.</p>
          </div>
          <div className="info-card">
            <h3>Student-Focused Learning</h3>
            <p>We believe in education over punishment. Our reports are designed to be learning opportunities, helping students understand their mistakes and improve their writing.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default WhyPlagixPage;
