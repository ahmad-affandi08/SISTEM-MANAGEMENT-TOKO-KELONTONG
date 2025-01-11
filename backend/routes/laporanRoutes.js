const express = require("express");
const { generateLaporan } = require("../controllers/laporanController");
const router = express.Router();

// Route untuk menghasilkan laporan
router.get("/", generateLaporan);

module.exports = router;
