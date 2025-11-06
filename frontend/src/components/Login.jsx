// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api.js';
import styles from './Onboarding.module.css';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.post('/auth/login', formData);
      onLoginSuccess(response.data);
      // Role-based redirect
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
    <div className={`${styles.section} ${styles.sectionBgWhite}`}>
      <div className="max-w-md mx-auto p-6 rounded-xl bg-white shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input name="email" type="email" value={formData.email} onChange={handleChange}
            placeholder="Email" required className="w-full px-3 py-2 border rounded mb-4" />
          <input name="password" type="password" value={formData.password} onChange={handleChange}
            placeholder="Password" required className="w-full px-3 py-2 border rounded mb-4" />

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded mb-4">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button type="button" onClick={() => navigate('/forgot-password')}
            className="text-indigo-600 text-sm w-full text-center">
            Forgot Password?
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-indigo-600">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;