const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController");
const authenticate = require("../middleware/authenticate");

// Tambah barang baru
router.post("/", authenticate, barangController.tambahBarang);

// Ambil semua barang
router.get("/", authenticate, barangController.getAllBarang);

// Ambil barang berdasarkan ID
router.get("/:id", authenticate, barangController.getBarangById);

// Update barang berdasarkan ID
router.put("/:id", authenticate, barangController.updateBarang);

// Hapus barang berdasarkan ID
router.delete("/:id", authenticate, barangController.deleteBarang);

module.exports = router;
