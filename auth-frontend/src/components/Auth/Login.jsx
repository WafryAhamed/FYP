import { useState, useContext } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import './Login.css';
const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      setUser({ role: res.data.role });
      if (res.data.role === "student") navigate("/dashboard/student");
      if (res.data.role === "instructor") navigate("/dashboard/instructor");
      if (res.data.role === "admin") navigate("/dashboard/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p style={{ cursor: "pointer", color: "blue" }} onClick={() => navigate("/forgot-password")}>Forgot Password?</p>
    </div>
  );
};

export default Login;
