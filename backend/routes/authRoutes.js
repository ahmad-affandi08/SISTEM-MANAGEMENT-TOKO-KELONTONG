const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");

const router = express.Router();

// Endpoint untuk register
router.post("/register", registerUser);

// Endpoint untuk login
router.post("/login", loginUser);

module.exports = router;
