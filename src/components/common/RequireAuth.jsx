// src/components/RequireAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, role = 'student' }) => {
  // simple example: you stored role on login
  const userRole = localStorage.getItem('plagix_role');
  if (!userRole || userRole !== role) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

export default RequireAuth;
