// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="brand">
        <Link to="/">AdaptiveLearn</Link>
      </div>
      <div className="links">
        {user ? (
          <>
            <span>Welcome, {user.firstName}</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
