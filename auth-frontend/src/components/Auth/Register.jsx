import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input name="roll" placeholder="Roll (Optional)" onChange={handleChange} />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <input name="confirmPassword" placeholder="Confirm Password" type="password" onChange={handleChange} required />
        <input name="passwordHint" placeholder="Password Hint" onChange={handleChange} />
        <select name="role" onChange={handleChange} required>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
