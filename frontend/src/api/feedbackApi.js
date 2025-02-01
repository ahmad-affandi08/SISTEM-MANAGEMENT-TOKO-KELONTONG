import axios from "axios";

// Base URL backend
const API_BASE_URL = "http://localhost:5000/api/feedback";

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

// Tambah Kritik dan Saran
export const createFeedback = async (feedbackData) => {
  try {
    const response = await axiosInstance.post("/", feedbackData);
    return response.data;
  } catch (error) {
    console.error(
      "Gagal menambahkan kritik dan saran:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Ambil Semua Kritik dan Saran
export const getAllFeedback = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Gagal mengambil data kritik dan saran:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Ambil Kritik dan Saran Berdasarkan ID
export const getFeedbackById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal mengambil kritik dan saran dengan ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Hapus Kritik dan Saran
export const deleteFeedback = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Gagal menghapus kritik dan saran dengan ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const getAllFeedbackWithoutUser = async () => {
    try {
      const response = await axiosInstance.get("/admin/feedbacks"); // Use /list instead of /all
      return response.data;
    } catch (error) {
      console.error(
        "Gagal mengambil semua kritik dan saran:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  };