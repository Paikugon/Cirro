import api from "./api";

const FOLDER_API = "/folder";


export const getFolderById = (id) => api.get(`${FOLDER_API}/${id}`);

export const createFolder = (data) => api.post(FOLDER_API, data);

export const updateFolder = (id, data) => api.put(`${FOLDER_API}/${id}`, data);

export const deleteFolder = (id) => api.delete(`${FOLDER_API}/${id}`);

export const getFolderTree = (ownerId) =>
  api.get(`${FOLDER_API}/tree/${ownerId}`);
export const getFolderContent = (id) =>
     api.get(`${FOLDER_API}/${id}/content`);
