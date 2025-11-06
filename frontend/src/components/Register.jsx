// src/components/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api.js';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', roll: 'student', email: '',
    password: '', confirmPassword: '', passwordHint: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); setLoading(false); return;
    }
    try {
      await authApi.post('/auth/register', formData);
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="name-row">
            <input name="firstName" value={formData.firstName} onChange={handleChange}
              placeholder="First Name" required />
            <input name="lastName" value={formData.lastName} onChange={handleChange}
              placeholder="Last Name" required />
          </div>
          <select name="roll" value={formData.roll} onChange={handleChange} required>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <input name="email" type="email" value={formData.email} onChange={handleChange}
            placeholder="Email" required />
          <input name="password" type="password" value={formData.password} onChange={handleChange}
            placeholder="Password" required />
          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange}
            placeholder="Confirm Password" required />
          <input name="passwordHint" value={formData.passwordHint} onChange={handleChange}
            placeholder="Password Hint (optional)" />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="switch-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;