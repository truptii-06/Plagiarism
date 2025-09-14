import React from 'react'
import { Link } from 'react-router-dom'
import './Userprofile.css'
import logo from '../../assets/logo1.png'  
const Userprofile = () => {
  return (
    <div className="user-profile-wrapper">
      <img src={logo} alt="PlagiX Logo" className="profile-logo" />   
      
      <div className="user-profile-container">
        <div className="title">Create User Profile</div>
        <p className="head">
          All users must have a user profile to use the service. 
          Please select how you will be using PlagiX:
        </p>
        <div className="options">
          <div className="option-card"><p><Link to="/register">As a Student</Link></p></div>
          <div className="option-card"><p>As a Teacher</p></div>
        </div>
        <div className="existing-user">
            <p>Already have a profile? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Userprofile
