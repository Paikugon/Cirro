import api from "./api";

const PERMISSION_API = "/permission";

// 🔹 Lấy tất cả quyền
export const getAllPermissions = () => api.get(PERMISSION_API);

// 🔹 Lấy quyền theo file
export const getPermissionsByFile = (fileId) =>
  api.get(`${PERMISSION_API}/file/${fileId}`);

export const getUserById = (user) =>
  api.get(`${PERMISSION_API}/user/${user}`);

// 🔹 Lấy quyền theo người dùng
export const getPermissionsByUser = (userId) =>
  api.get(`${PERMISSION_API}/user/${userId}`);

// 🔹 Tạo mới quyền (hoặc cập nhật nếu đã tồn tại)
export const createPermission = (data) => api.post(PERMISSION_API, data);

export const createPermissionByEmail = (data) =>
  api.post(`${PERMISSION_API}/share-by-email`, data);

// 🔹 Cập nhật quyền
export const updatePermission = (id, data) =>
  api.put(`${PERMISSION_API}/${id}`, data);

// 🔹 Xóa quyền
export const deletePermission = (id) => api.delete(`${PERMISSION_API}/${id}`);
