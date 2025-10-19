import api from "./api";

export const login = async (username, password) => {
  try {
    const response = await api.post("/Auth/login", { username, password });
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      "Đăng nhập thất bại. Vui lòng thử lại!";
    throw new Error(msg);
  }
};

export const register = async (username, password, email) => {
  try {
    const response = await api.post("/Auth/register", {
      username,
      password,
      email,
    });
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      "Đăng ký thất bại. Vui lòng thử lại!";
    throw new Error(msg);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/Auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      "Gửi mã OTP thất bại. Vui lòng thử lại!";
    throw new Error(msg);
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/Auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      "Xác nhận OTP thất bại. Vui lòng thử lại!";
    throw new Error(msg);
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await api.post("/Auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      "Đặt lại mật khẩu thất bại. Vui lòng thử lại!";
    throw new Error(msg);
  }
};