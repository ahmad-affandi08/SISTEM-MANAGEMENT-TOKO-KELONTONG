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
const authorize = require("../middleware/authorize");

const router = express.Router();

// Tambah karyawan baru (hanya admin yang bisa menambah)
router.post("/", authenticate, authorize(["admin"]), tambahKaryawan);

// Ambil semua data karyawan
router.get("/", authenticate, authorize(["admin"]), getKaryawan);

// Ambil detail karyawan berdasarkan ID
router.get(
  "/me",
  authenticate,
  authorize(["admin", "kasir"]),
  getKaryawanByUserLogin
);

// Update data karyawan
router.put("/:id", authenticate, authorize(["admin", "kasir"]), updateKaryawan);

// Hapus data karyawan
router.delete("/:id", authenticate, authorize(["admin"]), hapusKaryawan);

module.exports = router;
