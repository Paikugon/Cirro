import api from "./api";

const USER_API = "/user";

export const getUserById = (id) => api.get(`${USER_API}/${id}`);
export const updateUser = (id, data) => api.put(`${USER_API}/${id}`, data);
export const deleteUser = (id) => api.delete(`${USER_API}/${id}`);
export const getAllUsers = () => api.get(USER_API);
export const getUserByUsername = (username) => api.get(`${USER_API}/username/${username}`);
export const getUserByEmail = (email) => api.get(`${USER_API}/email/${email}`);
export const getUserByPhone = (phone) => api.get(`${USER_API}/phone/${phone}`);
export const getUserByAddress = (address) => api.get(`${USER_API}/address/${address}`);
export const getUserByCity = (city) => api.get(`${USER_API}/city/${city}`);
export const getUserByState = (state) => api.get(`${USER_API}/state/${state}`);
export const getUserByZip = (zip) => api.get(`${USER_API}/zip/${zip}`);
export const getUserByCountry = (country) => api.get(`${USER_API}/country/${country}`);