import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('You have been logged out');
    navigate('/');
  };

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        <Link to="/">AdaptiveLearn</Link>
      </div>
      <div className={`nav-links ${open ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/contact">Contact</Link>
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="nav-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn-outline">Login</Link>
            <Link to="/register" className="nav-btn-primary">Sign Up</Link>
          </>
        )}
      </div>
      <button className="nav-toggle" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Menu'}
      </button>
    </nav>
  );
};

export default Navbar;
