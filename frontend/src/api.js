import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Auth API
export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);
export const logoutUser = (token) =>
  axios.post(`${API_URL}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const forgotPassword = (data) => axios.post(`${API_URL}/auth/forgot-password`, data);
export const resetPassword = (data) => axios.post(`${API_URL}/auth/reset-password`, data);

// User API
export const getProfile = (token) =>
  axios.get(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });

// Optional: default export to allow `import api from './api'` if needed
export default {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile
};
