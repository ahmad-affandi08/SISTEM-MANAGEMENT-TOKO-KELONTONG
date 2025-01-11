import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Fungsi untuk login
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    // Cek apakah statusnya sukses dan data yang diterima sesuai
    if (response.status === 200 && response.data.token) {
      return response.data;
    } else {
      throw new Error("Invalid response data");
    }
  } catch (error) {
    // Menangani error login
    console.error(
      "Login failed",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      "Login failed: " +
        (error.response ? error.response.data.message : error.message)
    );
  }
};

// Fungsi untuk register
export const registerUser = async (username, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
};
