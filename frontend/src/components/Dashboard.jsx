import React, { useEffect, useState } from 'react';
import { getProfile, logoutUser } from '../api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(token);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser(token);
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      alert('You have been logged out');
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <h2>Dashboard</h2>
      {user && (
        <div>
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.roll}</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
