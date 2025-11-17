import React, { useState } from 'react';
import './Setting.css'; // We'll create this new CSS file next

const Settings = () => {
  // State for profile information
  const [profile, setProfile] = useState({
    name: 'Trupti Dhandar', // You would fetch this data from your backend
    email: 'trupti@example.com',
  });

  // State for password change form
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Here you would call your backend API to update the profile
    alert(`Profile updated successfully for ${profile.name}!`);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // Here you would call your backend API to change the password
    alert('Password updated successfully!');
    setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      
      {/* Profile Information Card */}
      <div className="settings-card">
        <h3>Profile Information</h3>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
            />
          </div>
          <button type="submit" className="settings-btn">Save Changes</button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="settings-card">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={password.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={password.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={password.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" className="settings-btn">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;