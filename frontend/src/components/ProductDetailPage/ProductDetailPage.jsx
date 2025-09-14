import React from 'react';
import { Link } from 'react-router-dom';
import './ProductDetailPage.css';

// Simple SVG icons for features (you can replace these with more detailed ones)
const OriginalityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m10 12.5 2 2 4-4"/></svg>
);
const AIIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);
const FeedbackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

function ProductDetailPage() {
  return (
    <div className="product-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bring transparency to the writing process with PlagiX Clarity</h1>
          <p>Unlock the full story behind every student submission, from first to final draft, all while guiding responsible AI use and building trust between students and educators.</p>
          <Link to="/contact" className="btn-primary">Request a Demo</Link>
        </div>
        <div className="hero-image-container">
          {/* Placeholder for a cool graphic */}
          <div className="hero-graphic">
            <AIIcon />
            <span>PlagiX Clarity</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Advance learning at every stage</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><OriginalityIcon /></div>
            <h3>Unmatched Originality Checking</h3>
            <p>Our industry-leading plagiarism detection scans against billions of sources to ensure academic integrity.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><AIIcon /></div>
            <h3>AI Writing Detection</h3>
            <p>Identify AI-generated content and guide students on the proper use of AI tools in their work.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FeedbackIcon /></div>
            <h3>Streamlined Feedback</h3>
            <p>Provide targeted, actionable feedback directly on student submissions to improve writing outcomes.</p>
          </div>
        </div>
      </section>

      {/* Alternating Content Section */}
      <section className="content-section">
        <div className="content-container">
          <div className="content-image">
            <img src="https://placehold.co/600x450/e0f2f1/007a8a?text=Similarity+Report" alt="PlagiX Similarity Report" />
          </div>
          <div className="content-text">
            <h3>An in-depth look at submissions</h3>
            <p>Go beyond a simple percentage score. Our intuitive Similarity Report highlights matching text and provides links to the original sources, giving you the full context to make an informed decision.</p>
            <Link to="/solutions/originality" className="text-link">Learn about originality checking &rarr;</Link>
          </div>
        </div>

        <div className="content-container reverse">
          <div className="content-image">
             <img src="https://placehold.co/600x450/e0f2f1/007a8a?text=AI+Indicator" alt="PlagiX AI Indicator" />
          </div>
          <div className="content-text">
            <h3>Confidently address AI writing</h3>
            <p>Our robust AI detector provides a clear indicator of AI-generated text within a submission. This opens the door for constructive conversations with students about academic integrity and the ethical use of technology.</p>
            <Link to="/solutions/ai-detection" className="text-link">Explore AI detection features &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section">
        <h2>Ready to Uphold Integrity at Your Institution?</h2>
        <p>Discover how PlagiX can support your academic goals.</p>
        <Link to="/register" className="btn-secondary">Get Started</Link>
      </section>
    </div>
  );
}

export default ProductDetailPage;
