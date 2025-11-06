// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
      navigate('/');
      alert('You have been logged out.');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">EduLearn</Link>
      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        {user && <span className="nav-link">Hello, {user.firstName}</span>}
        {user && <button onClick={handleLogout} className="nav-link">Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;