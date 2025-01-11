import axios from "axios";

// Base URL backend
const API_BASE_URL = "http://localhost:5000/api/karyawan";

// Ambil token dari localStorage atau tempat penyimpanan lainnya
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Konfigurasi axios dengan token
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan token pada setiap permintaan
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tambah Karyawan
export const createKaryawan = async (karyawanData) => {
  try {
    const response = await axiosInstance.post("/", karyawanData);
    return response.data;
  } catch (error) {
    console.error(
      "Gagal menambahkan karyawan:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Ambil Semua Karyawan
export const getAllKaryawan = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Gagal mengambil data karyawan:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Ambil Karyawan Berdasarkan ID
export const getKaryawanByUserLogin = async () => {
  try {
    const response = await axiosInstance.get(`/me`);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal mengambil Data Karyawan`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Update Karyawan
export const updateKaryawan = async (id, karyawanData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, karyawanData);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal memperbarui karyawan dengan ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Hapus Karyawan
export const deleteKaryawan = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal menghapus karyawan dengan ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};
