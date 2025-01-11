const express = require("express");
const transaksiController = require("../controllers/transaksiController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/", authenticate, transaksiController.createTransaksi);
router.get("/", authenticate, transaksiController.getAllTransaksi);
router.get("/:id", authenticate, transaksiController.getTransaksiById);
router.delete("/:id", authenticate, transaksiController.deleteTransaksi);

module.exports = router;
