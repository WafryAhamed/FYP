import React, { useState } from 'react';
import { resetPassword } from '../api';
import './ResetPassword.css';

const ResetPassword = () => {
  const [form, setForm] = useState({ email: '', newPassword: '', confirmNewPassword: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmNewPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const res = await resetPassword(form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="newPassword" placeholder="New Password" value={form.newPassword} onChange={handleChange} required />
        <input type="password" name="confirmNewPassword" placeholder="Confirm New Password" value={form.confirmNewPassword} onChange={handleChange} required />
        <button type="submit">Reset</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
