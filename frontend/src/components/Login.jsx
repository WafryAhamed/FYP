// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api.js';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const response = await authApi.post('/auth/login', formData);
      onLoginSuccess(response.data);
      const role = response.data.user.role;
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'instructor') navigate('/dashboard/instructor');
      else navigate('/dashboard/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In</h2>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" value={formData.email} onChange={handleChange}
            placeholder="Email" required />
          <input name="password" type="password" value={formData.password} onChange={handleChange}
            placeholder="Password" required />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <button className="forgot-btn" onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </button>
        <p className="switch-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;