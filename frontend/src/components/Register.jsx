// src/components/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api.js';
import styles from './Onboarding.module.css';

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
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authApi.post('/auth/register', formData);
      setSuccess('Registration successful! Please check your email to activate your account.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.section} ${styles.sectionBgWhite}`}>
      <div className="max-w-md mx-auto p-6 rounded-xl bg-white shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input name="firstName" value={formData.firstName} onChange={handleChange}
              placeholder="First Name" required className="w-full px-3 py-2 border rounded" />
            <input name="lastName" value={formData.lastName} onChange={handleChange}
              placeholder="Last Name" required className="w-full px-3 py-2 border rounded" />
          </div>

          <select name="roll" value={formData.roll} onChange={handleChange}
            className="w-full px-3 py-2 border rounded mb-4">
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          <input name="email" type="email" value={formData.email} onChange={handleChange}
            placeholder="Email" required className="w-full px-3 py-2 border rounded mb-4" />

          <input name="password" type="password" value={formData.password} onChange={handleChange}
            placeholder="Password" required className="w-full px-3 py-2 border rounded mb-4" />

          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange}
            placeholder="Confirm Password" required className="w-full px-3 py-2 border rounded mb-4" />

          <input name="passwordHint" value={formData.passwordHint} onChange={handleChange}
            placeholder="Password Hint (optional)" className="w-full px-3 py-2 border rounded mb-6" />

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;