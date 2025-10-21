import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getUserId } from "../api/api";
import { login, register, forgotPassword as forgotPasswordApi, verifyOtp as verifyOtpApi, resetPassword as resetPasswordApi } from "../api/authApi";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const restoreUser = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.UserId;
          const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
          if (!username) {
            throw new Error("Không tìm thấy username trong token");
          }
          setUser({ userId, username });
        }
      } catch (error) {
        console.error("Lỗi khi khôi phục user:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const loginUser = async (username, password) => {
    try {
      const data = await login(username, password);
      const { accessToken, refreshToken } = data.data;

      if (!accessToken) {
        throw new Error("Không nhận được accessToken từ server!");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const userId = getUserId();
      setUser({ userId, username });
      navigate("/dashboard");
      return data;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.message);
      throw new Error(error.message || "Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  const registerUser = async (username, password, email) => {
    try {
      const response = await register(username, password, email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await forgotPasswordApi(email); // Sửa: gọi forgotPasswordApi
      return response;
    } catch (error) {
      throw new Error(error.message || "Gửi mã OTP thất bại!");
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await verifyOtpApi(email, otp);
      return response;
    } catch (error) {
      throw new Error(error.message || "Xác nhận OTP thất bại!");
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await resetPasswordApi(email, otp, newPassword);
      return response;
    } catch (error) {
      throw new Error(error.message || "Đặt lại mật khẩu thất bại!");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        forgotPassword,
        verifyOtp,
        resetPassword,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};