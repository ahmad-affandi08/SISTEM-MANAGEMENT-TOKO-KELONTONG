const express = require("express");
const transaksiController = require("../controllers/transaksiController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(["admin", "kasir"]),
  transaksiController.createTransaksi
);
router.get(
  "/",
  authenticate,
  authorize(["admin"]),
  transaksiController.getAllTransaksi
);
router.get(
  "/:id",
  authenticate,
  authorize(["admin"]),
  transaksiController.getTransaksiById
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  transaksiController.deleteTransaksi
);

module.exports = router;
