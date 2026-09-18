import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🎯 Career Advisor</Link>
      <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>
      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" onClick={closeMobileMenu}>Home</Link>
        <Link to="/#features" onClick={closeMobileMenu}>Features</Link>
        <Link to="/school-finder" onClick={closeMobileMenu}>School Finder</Link>
        <Link to="/govt-residential-school-finder" onClick={closeMobileMenu}>Govt Residential Schools</Link>
        <Link to="/college-finder" onClick={closeMobileMenu}>College Finder</Link>
        <Link to="/course-finder" onClick={closeMobileMenu}>Course Finder</Link>
        <Link to="/entrance-exam-finder" onClick={closeMobileMenu}>Entrance Exams</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" onClick={closeMobileMenu}>Dashboard</Link>
            <Link to="/profile" onClick={closeMobileMenu}>Profile</Link>
            <button className="link-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn login-btn" onClick={closeMobileMenu}>Login</Link>
            <Link to="/register" className="nav-btn register-btn" onClick={closeMobileMenu}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
