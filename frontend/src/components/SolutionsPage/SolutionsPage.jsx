// src/components/SolutionsPage/SolutionsPage.jsx

import React from 'react';
// Re-using the same CSS as the WhyPlagiX page for consistency
import '../WhyPlagixPage/WhyPlagixPage.css';

function SolutionsPage() {
  return (
    <div className="generic-page-container">
      <header className="page-hero">
        <h1>Our Solutions</h1>
        <p>Tailored tools for every academic environment.</p>
      </header>
      <main className="page-main-content">
        <section className="page-section card-layout">
          <div className="info-card">
            <h3>For Higher Education</h3>
            <p>Integrate PlagiX with your LMS to provide university-wide integrity solutions, from undergraduate essays to postgraduate research.</p>
          </div>
          <div className="info-card">
            <h3>For K-12 Schools</h3>
            <p>Introduce the concepts of originality and proper citation to younger students with easy-to-understand reports and feedback tools.</p>
          </div>
          <div className="info-card">
            <h3>For Research & Publishing</h3>
            <p>Ensure the integrity of scholarly articles, journals, and publications with our comprehensive and trusted similarity checking.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SolutionsPage;
