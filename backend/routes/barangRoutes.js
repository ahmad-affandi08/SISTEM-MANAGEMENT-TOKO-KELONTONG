const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// Tambah barang baru
router.post("/", authenticate, barangController.tambahBarang);

// Ambil semua barang
router.get(
  "/",
  authenticate,
  authorize(["admin", "kasir"]),
  barangController.getAllBarang
);

// Ambil barang berdasarkan ID
router.get(
  "/:id",
  authenticate,
  authorize(["admin"]),
  barangController.getBarangById
);

// Update barang berdasarkan ID
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  barangController.updateBarang
);

// Hapus barang berdasarkan ID
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  barangController.deleteBarang
);

module.exports = router;
