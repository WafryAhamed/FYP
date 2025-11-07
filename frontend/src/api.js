import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if your backend is on another port
  withCredentials: true, // send cookies automatically
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);
export const getProfile = () => API.get('/user/profile');

export default API;
