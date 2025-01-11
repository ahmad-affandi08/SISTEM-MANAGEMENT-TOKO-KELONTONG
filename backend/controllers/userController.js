const User = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Gagal mendapatkan data user.", error });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username sudah digunakan." });
    }

    // Create a new user
    const user = await User.create({ username, password, role });
    res.status(201).json({ message: "User berhasil dibuat.", user });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat user.", error });
  }
};

// Update user data
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    user.username = username || user.username;
    if (password) {
      user.password = password;
    }
    user.role = role || user.role;

    await user.save();
    res.status(200).json({ message: "User berhasil diperbarui.", user });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui user.", error });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    res.status(200).json({ message: "User berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus user.", error });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
