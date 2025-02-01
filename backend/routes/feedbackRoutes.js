const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const authenticate = require ("../middleware/authenticate");

// Rute untuk menambahkan kritik dan saran
router.post("/", authenticate,feedbackController.createFeedback);

// Rute untuk mendapatkan semua kritik dan saran
router.get("/", authenticate,feedbackController.getAllFeedback);

// Rute untuk mendapatkan kritik dan saran berdasarkan ID
router.get("/:id", authenticate,feedbackController.getFeedbackById);

// Rute untuk menghapus kritik dan saran berdasarkan ID
router.delete("/:id",authenticate, feedbackController.deleteFeedback);

// Route untuk mendapatkan seluruh data feedback (Admin)
router.get("/admin/feedbacks", authenticate, feedbackController.getAllFeedbacksAdmin);

module.exports = router;