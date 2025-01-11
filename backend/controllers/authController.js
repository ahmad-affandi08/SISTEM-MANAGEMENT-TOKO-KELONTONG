const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Karyawan = require("../models/Karyawan");

// Fungsi untuk register pengguna
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Mengecek apakah username sudah terdaftar
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Membuat user baru
    const newUser = new User({
      username,
      password,
      role,
    });

    // Menyimpan user ke database
    await newUser.save();

    // Membuat JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Mencari user berdasarkan username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Memeriksa apakah password cocok
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Membuat JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { registerUser, loginUser };
