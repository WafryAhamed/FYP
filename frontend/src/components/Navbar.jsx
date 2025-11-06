// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Import Link
import "../styles.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">EduLearn</Link>
      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        {user && (
          <>
            <span className="nav-link" style={{ pointerEvents: 'none' }}>
              Hello, {user.name}
            </span>
            <button onClick={handleLogout} className="nav-link">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;