import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Homepage from './components/Homepage/Homepage';
import Loginpage from './components/Loginpage/Loginpage';
import Registerpage from './components/Registerpage/Register';
import ProductDetailPage from './components/ProductDetailPage/ProductDetailPage';
import Dashboard from './components/Dashboard/Dashboard';
import WhyPlagixPage from './components/WhyPlagixPage/WhyPlagixPage'; 
import PartnersPage from './components/PartnersPage/PartnersPage';
import ResourcesPage from './components/ResourcesPage/ResourcesPage';
import SolutionsPage from './components/SolutionsPage/SolutionsPage';
import SupportPage from './components/Dashboard/SupportPage/SupportPage';
import ContactPage from './components/ContactPage/ContactPage';
import Userprofile from './components/Userprofile/Userprofile';

// Layout wrapper to hide Navbar/Footer on login/register/dashboard
const Layout = ({ children }) => {
  const location = useLocation();
  
  const hideLayout = location.pathname.startsWith('/dashboard') || location.pathname === '/login' || 
                     location.pathname === '/register' || location.pathname === '/Userprofile';

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
          <Route path="/why-plagix" element={<WhyPlagixPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/Userprofile" element={<Userprofile />} />

          {/* Only this single route handles both student/teacher dashboards */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch-all 404 page */}
          <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
