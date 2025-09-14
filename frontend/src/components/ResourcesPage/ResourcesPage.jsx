// src/components/ResourcesPage/ResourcesPage.jsx

import React from 'react';
import '../WhyPlagixPage/WhyPlagixPage.css';

function ResourcesPage() {
  return (
    <div className="generic-page-container">
      <header className="page-hero">
        <h1>Resources</h1>
        <p>Insights and support to help you succeed.</p>
      </header>
      <main className="page-main-content">
        <section className="page-section card-layout">
          <div className="info-card">
            <h3>Blog</h3>
            <p>Read the latest articles on academic integrity, AI in education, and best practices for using PlagiX.</p>
          </div>
          <div className="info-card">
            <h3>Case Studies</h3>
            <p>Discover how institutions like yours are using PlagiX to improve learning outcomes and uphold standards.</p>
          </div>
          <div className="info-card">
            <h3>Support Center</h3>
            <p>Find answers to your questions, access user guides, and get in touch with our dedicated support team.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ResourcesPage;
