import React, { useState, useEffect } from "react";
import { createFeedback, getAllFeedback } from "../../api/feedbackApi";
import Swal from "sweetalert2";

const FeedbackForm = () => {
  const [name, setName] = useState(""); // State for the name input
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feedback when component is mounted
  useEffect(() => {
    fetchFeedback();
  }, []);

  // Fetch feedback from API
  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await getAllFeedback();
      console.log("Data dari API:", response); // Debugging to check API response
      setFeedbackList(Array.isArray(response.data) ? response.data : []); // Use response.data instead of the whole response
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedbackList([]); // If there's an error, set feedbackList as empty array
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !feedback.trim()) {
      Swal.fire("Peringatan", "Nama dan Kritik & Saran tidak boleh kosong!", "warning");
      return;
    }

    try {
      // Submit feedback with name and message
      await createFeedback({ name, message: feedback });
      Swal.fire("Terima kasih!", "Kritik & saran Anda telah dikirim.", "success");
      setName(""); // Reset name input
      setFeedback(""); // Reset feedback input
      fetchFeedback(); // Re-fetch feedback after submit
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan, coba lagi.", "error");
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="p-6 max-w-md w-full bg-white shadow-md rounded-lg">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Kritik & Saran</h2>

    {/* Input nama */}
    <input
      type="text"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      placeholder="Masukkan nama Anda"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    {/* Form input kritik & saran */}
    <textarea
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      rows="4"
      placeholder="Tulis kritik & saran Anda..."
      value={feedback}
      onChange={(e) => setFeedback(e.target.value)}
    ></textarea>

    <button
      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? "Mengirim..." : "Kirim"}
    </button>

    {/* Daftar Kritik & Saran */}
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Daftar Kritik & Saran</h3>

      {loading ? (
        <p className="text-gray-500 mt-2">Memuat data...</p>
      ) : feedbackList.length === 0 ? (
        <p className="text-gray-500 mt-2">Belum ada kritik & saran.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {feedbackList.map((item, index) => (
            <li key={index} className="p-3 border rounded-lg bg-gray-100">
              <strong>{item.name}</strong>: {item.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</div>
  );
};

export default FeedbackForm;
