import api from "./api";

const FILE_API = "/file"; // vì controller là [Route("api/[controller]")]

// ✅ GET: Lấy tất cả file trong một folder
export const getFilesByFolder = (folderId) =>
  api.get(`${FILE_API}/folder/${folderId}`);

// ✅ GET: Lấy file theo ID
export const getFileById = (id) => api.get(`${FILE_API}/${id}`);

// ✅ POST: Upload file (multipart/form-data)
export const uploadFile = (formData) =>
  api.post(`${FILE_API}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ✅ GET: Tải xuống file (trả về Blob để download)
export const downloadFile = (id) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/api${FILE_API}/download/${id}`;
  window.open(url, "_blank");
};



// ✅ DELETE: Xóa file
export const deleteFile = (id) => api.delete(`${FILE_API}/${id}`);
