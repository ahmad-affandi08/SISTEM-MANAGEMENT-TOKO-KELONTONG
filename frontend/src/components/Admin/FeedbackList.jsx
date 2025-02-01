import React, { useEffect, useState } from "react";
import { getAllFeedbackWithoutUser } from "../../api/feedbackApi";
import Swal from "sweetalert2";

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  const fetchAllFeedback = async () => {
    setLoading(true);
    try {
      const data = await getAllFeedbackWithoutUser();
      if (data.success) {
        setFeedbackList(data.data); // Set feedback data from the response
      } else {
        Swal.fire("Gagal", "Tidak dapat memuat data kritik dan saran.", "error");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat mengambil data.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Format tanggal Indonesia
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-w-max p-6 bg-background border-2 border-border m-6 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-semibold mb-4 text-teks">Daftar Kritik & Saran</h1>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : feedbackList.length === 0 ? (
        <p className="text-gray-500">Belum ada kritik & saran.</p>
      ) : (
        <ul className="space-y-4">
          {feedbackList.map((item) => (
            <li key={item._id} className="p-4 border rounded-lg bg-gray-100">
              <strong className="block text-xl">{item.name}</strong>
              <p className="text-gray-700">{item.message}</p>
              <span className="block text-sm text-gray-500 mt-2">{formatDate(item.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackList;
