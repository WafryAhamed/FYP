import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      alert('You have been logged out');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error logging out');
    }
  };

  return (
    <nav style={{ padding: '1rem', background: '#4f46e5', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/" style={{ color: 'white', fontWeight: 700 }}>AdaptiveLearn</Link>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>{user.firstName} ({user.roll})</span>
            <button onClick={handleLogout} style={{ background: 'white', color: '#4f46e5', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem', color: 'white' }}>Login</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
