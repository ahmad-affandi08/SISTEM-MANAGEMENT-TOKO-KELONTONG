import React, { useEffect, useState } from "react";
import { fetchLogs, deleteLogById, deleteAllLogs } from "../../api/logApi";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Loading from "../Loading";

const LogActivity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getLogs = async () => {
      try {
        const data = await fetchLogs();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, []);

  // Fungsi untuk menghapus log berdasarkan ID dengan konfirmasi
  const handleDeleteById = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Log aktivitas ini akan dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteLogById(id);
        setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
        Swal.fire({
          icon: "success",
          title: "Log Dihapus",
          text: "Log aktivitas telah dihapus.",
        });
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus Log",
          text: "Terjadi kesalahan saat menghapus log.",
        });
      }
    }
  };

  // Fungsi untuk menghapus semua log
  const handleDeleteAll = async () => {
    if (logs.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Tidak Ada Log",
        text: "Tidak ada log yang tersedia untuk dihapus.",
      });
      return;
    }

    try {
      await deleteAllLogs();
      setLogs([]);
      Swal.fire({
        icon: "success",
        title: "Semua Log Dihapus",
        text: "Semua log aktivitas telah dihapus.",
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus Log",
        text: "Terjadi kesalahan saat menghapus semua log.",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 border-2 m-6 border-border rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Log Aktivitas
      </h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-red-600 text-lg font-medium">{error}</p>
      ) : logs.length === 0 ? (
        <p className="text-white">Tidak ada log aktivitas.</p>
      ) : (
        <>
          <button
            onClick={handleDeleteAll}
            className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Hapus Semua Log
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {logs.map((log) => (
              <div
                key={log._id}
                className="bg-white p-6 rounded-lg shadow-xl border border-border transition-transform transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-utama">
                    {new Date(log.timestamp).toLocaleString()}
                  </h2>
                  {log.status === "berhasil" && (
                    <FaCheckCircle className="text-green-500 text-3xl" />
                  )}
                </div>
                <p className="text-teks text-base">
                  Pengguna: {log.userId?.username || "Tidak Diketahui"}
                </p>
                <p className="text-teks text-base">
                  Aksi: <span className="capitalize">{log.action}</span>
                </p>
                <p className="text-teks text-base">Model: {log.entity}</p>
                <p className="text-teks text-base">
                  Deskripsi: {log.description}
                </p>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleDeleteById(log._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LogActivity;
