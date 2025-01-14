const express = require("express");
const router = express.Router();
const kategoriController = require("../controllers/kategoriController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// Tambah kategori
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  kategoriController.tambahKategori
);

// Ambil semua kategori
router.get(
  "/",
  authenticate,
  authorize(["admin"]),
  kategoriController.getAllKategori
);

// Ambil kategori berdasarkan ID
router.get(
  "/:id",
  authenticate,
  authorize(["admin"]),
  kategoriController.getKategoriByKode
);

// Update kategori berdasarkan ID
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  kategoriController.updateKategori
);

// Hapus kategori berdasarkan ID
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  kategoriController.deleteKategori
);

module.exports = router;
