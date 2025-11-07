// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { forgotPassword } from "../api";
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message || "Check your email for reset link");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset link");
      setMessage("");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
