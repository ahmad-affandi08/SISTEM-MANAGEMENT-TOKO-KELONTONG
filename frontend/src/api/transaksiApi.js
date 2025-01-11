import axios from "axios";

// Ambil token dari localStorage atau tempat penyimpanan lainnya
const getAuthToken = () => {
  return localStorage.getItem("token");
};

const API_URL = "http://localhost:5000/api/transaksi";

// Konfigurasi axios dengan token autentikasi
const axiosInstance = axios.create({
  baseURL: API_URL,
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

// Buat transaksi baru
export const createTransaksi = async (transaksiData) => {
  try {
    const response = await axiosInstance.post("/", transaksiData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating transaction:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// Ambil semua transaksi
export const getAllTransaksi = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all transactions:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// Ambil transaksi berdasarkan ID
export const getTransaksiById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching transaction with ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// Hapus transaksi berdasarkan ID
export const deleteTransaksi = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting transaction with ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
