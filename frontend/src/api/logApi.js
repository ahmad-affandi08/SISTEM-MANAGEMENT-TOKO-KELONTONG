import axios from "axios";

// Base URL untuk API log aktivitas
const BASE_URL = "http://localhost:5000/api/logs";

// Ambil semua log aktivitas
export const fetchLogs = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil log aktivitas"
    );
  }
};

// Hapus log aktivitas berdasarkan ID
export const deleteLogById = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal menghapus log aktivitas"
    );
  }
};

// Hapus semua log aktivitas
export const deleteAllLogs = async () => {
  try {
    await axios.delete(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal menghapus semua log aktivitas"
    );
  }
};
