import axios from "axios";

// Fungsi untuk mendapatkan token autentikasi dari localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

const API_BASE = "http://localhost:5000/api/kategori";

// Konfigurasi axios dengan token autentikasi
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Menambahkan token ke header untuk setiap request
axiosInstance.interceptors.request.use(
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

// Tambah Kategori
export const createKategori = async (kategoriData) => {
  try {
    const response = await axiosInstance.post("/", kategoriData);
    return response.data;
  } catch (error) {
    console.error(
      "Gagal menambahkan kategori:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Ambil Semua Kategori
export const getAllKategori = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Gagal mengambil data kategori:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Ambil Kategori Berdasarkan kode_kategori
export const getKategoriByKode = async (kode_kategori) => {
  try {
    const response = await axiosInstance.get(`/kategori/${kode_kategori}`);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal mengambil kategori dengan kode_kategori ${kode_kategori}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Update Kategori
export const updateKategori = async (id, kategoriData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, kategoriData);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal memperbarui kategori dengan ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Hapus Kategori
export const deleteKategori = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal menghapus kategori dengan ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};
