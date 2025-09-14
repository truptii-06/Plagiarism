// src/components/ContactPage/ContactPage.jsx

import React, { useState } from 'react';
// We are reusing the CSS from the Support Page
import '../Dashboard/SupportPage/SupportContact.css';

function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
    setSubmitted(true);
    // Here you would typically send the form data to a backend server
  };

  return (
    <div className="sc-page-container">
      <header className="sc-page-header">
        <h1>Contact Us</h1>
        <p>Have a question or want to partner with us? We’d love to hear from you.</p>
      </header>
      
      <section className="sc-content-section">
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ color: '#007a8a' }}>Thank You!</h2>
            <p>Your message has been sent successfully. We'll get back to you shortly.</p>
          </div>
        ) : (
          <>
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formState.name} onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formState.email} onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" value={formState.subject} onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={formState.message} onChange={handleChange} required className="form-textarea"></textarea>
              </div>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default ContactPage;
