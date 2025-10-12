// File: src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("Axios baseURL:", api.defaults.baseURL); // Log baseURL

export default api;