const express = require("express");
const LogActivity = require("../models/LogActivity");
const {
  getAllLogs,
  deleteLogById,
  deleteAllLogs,
} = require("../controllers/logActivityController");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

// Route untuk mengambil log aktivitas
router.get("/", async (req, res) => {
  try {
    const logs = await LogActivity.find()
      .populate("userId", "username") // Pastikan ini untuk mengambil username dari userId
      .sort({ createdAt: -1 });

    // Menambahkan informasi username ke dalam log
    res.status(200).json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil log aktivitas", error: error.message });
  }
});

// Endpoint untuk mengambil semua log aktivitas
router.get("/", authenticate, getAllLogs);

// Endpoint untuk menghapus log aktivitas berdasarkan ID
router.delete("/:id", authenticate, deleteLogById);

// Endpoint untuk menghapus semua log aktivitas
router.delete("/", authenticate, deleteAllLogs);

module.exports = router;
