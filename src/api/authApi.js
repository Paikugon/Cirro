import api from "./api";

export const login = async (username, password) => {
  try {
    const response = await api.post("/Auth/login", { username, password });
    return response.data;
  } catch (error) {
    // ✅ Lấy đúng thông báo từ backend
    const msg =
      error?.response?.data?.message ||
      "Đăng nhập thất bại. Vui lòng thử lại!";
    throw new Error(msg); // ✅ Ném Error có message thật
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
