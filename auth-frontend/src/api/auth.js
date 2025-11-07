import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// Register user
export const register = (data) => API.post("/register", data);

// Login
export const login = (data) => API.post("/login", data);

// Logout
export const logout = () => API.post("/logout");

// Forgot password (show hint)
export const forgotPassword = (data) => API.post("/forgot-password", data);

// Send reset email
export const sendReset = (data) => API.post("/send-reset", data);

// Reset password
export const resetPassword = (data) => API.post("/reset-password", data);
