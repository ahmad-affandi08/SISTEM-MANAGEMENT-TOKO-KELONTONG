import axios from "axios";

const USERS_API_URL = "http://localhost:5000/api/users";

// Fungsi untuk mendapatkan token autentikasi dari localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Set token ke header Authorization
const setAuthHeader = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Konfigurasi axios dengan token autentikasi
const axiosInstanceUsers = axios.create({
  baseURL: USERS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Menambahkan token ke header untuk setiap request (Pengguna)
axiosInstanceUsers.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// GET: Ambil semua user
export const getAllUsers = async () => {
  try {
    const response = await axiosInstanceUsers.get(
      "/",
      setAuthHeader(getAuthToken())
    );
    return response.data;
  } catch (error) {
    console.error(
      "Gagal mengambil data user:",
      error.response?.data || "Error"
    );
    throw error.response?.data || "Gagal mengambil data user.";
  }
};

// POST: Tambah user baru
export const createUser = async (userData) => {
  try {
    const response = await axiosInstanceUsers.post(
      "/",
      userData,
      setAuthHeader(getAuthToken())
    );
    return response.data;
  } catch (error) {
    console.error("Gagal membuat user:", error.response?.data || "Error");
    throw error.response?.data || "Gagal membuat user.";
  }
};

// PUT: Update user berdasarkan ID
export const updateUser = async (id, updatedData) => {
  try {
    const response = await axiosInstanceUsers.put(
      `/${id}`,
      updatedData,
      setAuthHeader(getAuthToken())
    );
    return response.data;
  } catch (error) {
    console.error(
      `Gagal memperbarui user dengan ID ${id}:`,
      error.response?.data || "Error"
    );
    throw error.response?.data || "Gagal memperbarui user.";
  }
};

// DELETE: Hapus user berdasarkan ID
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstanceUsers.delete(
      `/${id}`,
      setAuthHeader(getAuthToken())
    );
    return response.data;
  } catch (error) {
    console.error(
      `Gagal menghapus user dengan ID ${id}:`,
      error.response?.data || "Error"
    );
    throw error.response?.data || "Gagal menghapus user.";
  }
};
