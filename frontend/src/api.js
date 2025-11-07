import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);
export const forgotPassword = (data) => axios.post(`${API_URL}/auth/forgot-password`, data);
export const resetPassword = (data) => axios.post(`${API_URL}/auth/reset-password`, data);
export const getProfile = (token) =>
  axios.get(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
export const logoutUser = (token) =>
  axios.post(`${API_URL}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
