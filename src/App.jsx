// src/App.jsx

import React from 'react';
// CORRECTED LINE: Added 'useLocation' to the import
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Homepage from './components/Homepage/Homepage';
import Loginpage from './components/Loginpage/Loginpage';
import Registerpage from './components/Registerpage/Register';
import ProductDetailPage from './components/ProductDetailPage/ProductDetailPage';
import Dashboard from './components/Dashboard/Dashboard';

// A helper component to conditionally render Navbar and Footer
// This component now works because 'useLocation' is imported correctly above
const Layout = ({ children }) => {
  const location = useLocation();
  // Don't show Navbar/Footer on dashboard pages
  const hideLayout = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!hideLayout && <Navbar />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
};


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/product/clarity" element={<ProductDetailPage />} />
          
          {/* This single route handles both dashboards */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Optional: Add a catch-all route for 404 pages */}
          <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

