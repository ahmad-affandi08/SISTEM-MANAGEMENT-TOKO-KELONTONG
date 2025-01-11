import axios from "axios";

const baseURL = "http://localhost:5000/api/laporan";

export const fetchLaporan = async () => {
  try {
    const response = await axios.get(`${baseURL}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching laporan:", error);
    throw error;
  }
};
