const mongoose = require("mongoose");
const LogActivity = require("../models/LogActivity");

// Ambil semua log aktivitas
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await LogActivity.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil log aktivitas",
      error: error.message,
    });
  }
};

// Hapus log aktivitas berdasarkan ID
exports.deleteLogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID log tidak valid" });
    }

    const log = await LogActivity.findByIdAndDelete(id);

    if (!log) {
      return res
        .status(404)
        .json({ message: `Log dengan ID ${id} tidak ditemukan` });
    }

    res.status(200).json({ message: `Log dengan ID ${id} berhasil dihapus` });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus log aktivitas",
      error: error.message,
    });
  }
};

// Hapus semua log aktivitas
exports.deleteAllLogs = async (req, res) => {
  try {
    await LogActivity.deleteMany({});

    res.status(200).json({ message: "Semua log aktivitas berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus semua log aktivitas",
      error: error.message,
    });
  }
};
