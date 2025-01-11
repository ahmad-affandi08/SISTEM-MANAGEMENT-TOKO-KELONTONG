const Kategori = require("../models/Kategori");
const LogActivity = require("../models/LogActivity");

exports.tambahKategori = async (req, res) => {
  try {
    const { kode_kategori, nama_kategori } = req.body;

    // Validasi apakah kategori dengan kode yang sama sudah ada
    const kategoriExist = await Kategori.findOne({ kode_kategori });
    if (kategoriExist) {
      return res.status(400).json({
        message: "Kategori dengan kode ini sudah ada",
      });
    }

    // Buat kategori baru
    const kategori = new Kategori({ kode_kategori, nama_kategori });
    await kategori.save();

    // Menambahkan log aktivitas
    await LogActivity.create({
      action: "CREATE",
      entity: "kategori",
      entityId: kategori._id,
      description: `Kategori ${nama_kategori} berhasil ditambahkan`,
      status: "success",
      userId: req.user._id,
    });

    res.status(201).json({
      message: "Kategori berhasil ditambahkan",
      data: kategori,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Gagal menambah kategori",
      error: error.message || error,
    });
  }
};

exports.getAllKategori = async (req, res) => {
  try {
    const kategori = await Kategori.find();

    if (!kategori.length) {
      return res.status(404).json({ message: "Tidak ada kategori ditemukan" });
    }

    res.status(200).json(kategori);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Gagal mengambil data kategori",
      error: error.message || error,
    });
  }
};

exports.getKategoriByKode = async (req, res) => {
  try {
    const { kode_kategori } = req.params;
    const kategori = await Kategori.findOne({ kode_kategori });

    if (!kategori) {
      return res.status(404).json({
        message: `Kategori dengan kode ${kode_kategori} tidak ditemukan`,
      });
    }

    res.status(200).json(kategori);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Gagal mengambil kategori",
      error: error.message || error,
    });
  }
};

const mongoose = require("mongoose");

exports.updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { kode_kategori, nama_kategori } = req.body;

    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const kategori = await Kategori.findByIdAndUpdate(
      id,
      { kode_kategori, nama_kategori },
      { new: true, runValidators: true }
    );

    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    // Menambahkan log aktivitas
    await LogActivity.create({
      action: "UPDATE",
      entity: "kategori",
      entityId: kategori._id,
      description: `Kategori dengan nama ${kategori.nama_kategori} dan ID ${kategori.kode_kategori} berhasil diperbarui`,
      status: "success",
      userId: req.user._id,
    });

    res.status(200).json({
      message: "Kategori berhasil diperbarui",
      data: kategori,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Gagal memperbarui kategori",
      error: error.message || error,
    });
  }
};

exports.deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const kategori = await Kategori.findByIdAndDelete(id);

    if (!kategori) {
      return res.status(404).json({
        message: `Kategori dengan ID ${id} tidak ditemukan`,
      });
    }

    // Menambahkan log aktivitas
    await LogActivity.create({
      action: "DELETE",
      entity: "kategori",
      entityId: kategori._id,
      description: `Kategori dengan nama ${kategori.nama_kategori} dan ID ${kategori.kodekategori} berhasil dihapus`,
      status: "success",
      userId: req.user._id,
    });

    res.status(200).json({
      message: "Kategori berhasil dihapus",
      data: kategori,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Gagal menghapus kategori",
      error: error.message || error,
    });
  }
};
