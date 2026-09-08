import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🎯 Career Advisor</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/#features">Features</Link>
        <Link to="/#explore">Explore</Link>
        <Link to="/#resources">Resources</Link>
        <Link to="/#about">About Us</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <button className="link-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn login-btn">Login</Link>
            <Link to="/register" className="nav-btn register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
