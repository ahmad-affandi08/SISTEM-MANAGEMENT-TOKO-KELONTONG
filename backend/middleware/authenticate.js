const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Akses ditolak, token tidak ada" });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cek apakah user ada di database
    const user = await User.findById(decoded.id).select("username role");
    if (!user) {
      return res.status(401).json({ message: "Pengguna tidak ditemukan" });
    }

    // Simpan informasi pengguna ke dalam request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token telah kadaluarsa" });
    }
    res.status(401).json({
      message: "Token tidak valid atau ada kesalahan dalam autentikasi",
    });
  }
};

module.exports = authenticate;
