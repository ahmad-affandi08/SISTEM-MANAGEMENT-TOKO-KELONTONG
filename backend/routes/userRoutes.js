const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authenticae = require("../middleware/authenticate");

// Routes for admin to manage users
router.get("/", authenticae, getAllUsers);
router.post("/", authenticae, createUser);
router.put("/:id", authenticae, updateUser);
router.delete("/:id", authenticae, deleteUser);

module.exports = router;
