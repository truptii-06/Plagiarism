import React, { useState } from 'react';
import './Setting.css';

const Setting = () => {
  const [formData, setFormData] = useState({
    fullName: 'Student Name',
    email: 'student@example.com',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add profile update logic here
    console.log('Updating profile:', {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password ? '********' : 'Not Changed'
    });
    alert('Profile updated!');
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password (optional)"
          />
        </div>
        <button type="submit" className="update-btn">Update Profile</button>
      </form>
    </div>
  );
};

export default Setting;