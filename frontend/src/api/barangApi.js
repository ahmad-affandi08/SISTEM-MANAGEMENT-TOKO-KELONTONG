import axios from "axios";

// Base URL backend
const API_BASE_URL = "http://localhost:5000/api/barang";

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

// Tambah Barang
export const createBarang = async (barangData) => {
  try {
    const response = await axiosInstance.post("/", barangData);
    return response.data;
  } catch (error) {
    console.error(
      "Gagal menambahkan barang:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Ambil Semua Barang
export const getAllBarang = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Gagal mengambil data barang:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Ambil Barang Berdasarkan ID
export const getBarangById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal mengambil barang dengan ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Update Barang
export const updateBarang = async (id, barangData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, barangData);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal memperbarui barang dengan ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Hapus Barang
export const deleteBarang = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal menghapus barang dengan ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Cari Barang Berdasarkan Kategori
export const getBarangByKategori = async (kategoriId) => {
  try {
    const response = await axiosInstance.get(`/kategori/${kategoriId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal mengambil barang dengan kategori ID ${kategoriId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};
