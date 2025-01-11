// routes/karyawanRoutes.js
const express = require("express");
const {
  tambahKaryawan,
  getKaryawan,
  updateKaryawan,
  hapusKaryawan,
  getKaryawanByUserLogin,
} = require("../controllers/karyawanController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Tambah karyawan baru (hanya admin yang bisa menambah)
router.post("/", authenticate, tambahKaryawan);

// Ambil semua data karyawan
router.get("/", authenticate, getKaryawan);

// Ambil detail karyawan berdasarkan ID
router.get("/me", authenticate, getKaryawanByUserLogin);

// Update data karyawan
router.put("/:id", authenticate, updateKaryawan);

// Hapus data karyawan
router.delete("/:id", authenticate, hapusKaryawan);

module.exports = router;
