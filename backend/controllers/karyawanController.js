// controllers/karyawanController.js
const Karyawan = require("../models/Karyawan");
const User = require("../models/User");

// Tambah Karyawan dan Akun Kasir
exports.tambahKaryawan = async (req, res) => {
  try {
    const {
      nama,
      alamat,
      telepon,
      tanggalLahir,
      jenisKelamin,
      tanggalMulaiKerja,
      gaji,
      shift,
      username,
      password,
      catatan,
    } = req.body;

    // Buat akun User untuk kasir tanpa hashing password
    const user = await User.create({
      username,
      password,
      role: "kasir",
    });

    // Buat data karyawan terhubung dengan user
    const karyawan = await Karyawan.create({
      nama,
      alamat,
      telepon,
      tanggalLahir,
      jenisKelamin,
      statusPekerjaan: "Aktif",
      tanggalMulaiKerja,
      gaji,
      shift,
      user: user._id,
      catatan,
    });

    res
      .status(201)
      .json({ message: "Karyawan berhasil ditambahkan", karyawan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Mendapatkan Semua Data Karyawan
exports.getKaryawan = async (req, res) => {
  try {
    const karyawan = await Karyawan.find().populate("user", "username role");
    res.status(200).json(karyawan);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Mengupdate Data Karyawan
exports.updateKaryawan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama,
      alamat,
      telepon,
      tanggalLahir,
      jenisKelamin,
      statusPekerjaan,
      tanggalMulaiKerja,
      gaji,
      shift,
      catatan,
    } = req.body;

    const karyawan = await Karyawan.findByIdAndUpdate(
      id,
      {
        nama,
        alamat,
        telepon,
        tanggalLahir,
        jenisKelamin,
        statusPekerjaan,
        tanggalMulaiKerja,
        gaji,
        shift,
        catatan,
      },
      { new: true }
    ).populate("user", "username role");

    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    res.status(200).json({ message: "Karyawan berhasil diperbarui", karyawan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Menghapus Data Karyawan dan Akun User
exports.hapusKaryawan = async (req, res) => {
  try {
    const { id } = req.params;

    const karyawan = await Karyawan.findById(id);
    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    // Hapus akun User terkait
    await User.findByIdAndDelete(karyawan.user);

    // Hapus data Karyawan
    await Karyawan.findByIdAndDelete(id);

    res.status(200).json({ message: "Karyawan berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Mendapatkan Detail Karyawan Berdasarkan User yang Login
exports.getKaryawanByUserLogin = async (req, res) => {
  try {
    // Mengambil ID user dari req.user yang sudah di-set oleh middleware protect
    const userId = req.user._id;

    // Mencari data karyawan berdasarkan user yang sedang login
    const karyawan = await Karyawan.findOne({ user: userId }).populate(
      "user",
      "username role"
    );

    if (!karyawan) {
      return res
        .status(404)
        .json({ message: "Karyawan tidak ditemukan untuk pengguna ini" });
    }

    // Mengembalikan data karyawan
    res.status(200).json(karyawan);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};
