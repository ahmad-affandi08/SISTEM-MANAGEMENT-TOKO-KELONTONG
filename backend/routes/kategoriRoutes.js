const express = require("express");
const router = express.Router();
const kategoriController = require("../controllers/kategoriController");
const authenticate = require("../middleware/authenticate");

// Tambah kategori
router.post("/", authenticate, kategoriController.tambahKategori);

// Ambil semua kategori
router.get("/", authenticate, kategoriController.getAllKategori);

// Ambil kategori berdasarkan ID
router.get("/:id", authenticate, kategoriController.getKategoriByKode);

// Update kategori berdasarkan ID
router.put("/:id", authenticate, kategoriController.updateKategori);

// Hapus kategori berdasarkan ID
router.delete("/:id", authenticate, kategoriController.deleteKategori);

module.exports = router;
