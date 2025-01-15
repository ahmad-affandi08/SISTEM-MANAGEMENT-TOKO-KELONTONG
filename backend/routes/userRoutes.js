const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
} = require("../controllers/userController");
const authenticae = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// Routes for admin to manage users
router.get("/", authenticae, authorize(["admin"]), getAllUsers);
router.post("/", authenticae, authorize(["admin"]), createUser);
router.put("/:id", authenticae, authorize(["admin", "kasir"]), updateUser);
router.put(
  "/update-password/:id",
  authenticae,
  authorize(["kasir"]),
  updatePassword
);
router.delete("/:id", authenticae, authorize(["admin"]), deleteUser);

module.exports = router;
