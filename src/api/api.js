
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const getAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không tìm thấy token");
  return token;
};


export const getUserId = () => {
  const token = getAuthToken();
  const decoded = jwtDecode(token);
  return (
    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    decoded.UserId ||
    null
  );
};

console.log("Axios baseURL:", api.defaults.baseURL); 

export default api;