const mongoose = require("mongoose");
const Barang = require("../models/Barang");
const Kategori = require("../models/Kategori");
const LogActivity = require("../models/LogActivity");

// Tambah barang
exports.tambahBarang = async (req, res) => {
  try {
    const {
      nama,
      kode_kategori,
      stok,
      satuan_pembelian,
      harga_beli,
      harga_jual,
    } = req.body;

    // Ambil userId dari token atau sesi yang terautentikasi
    const userId = req.user._id;

    const barangExist = await Barang.findOne({ nama });
    if (barangExist) {
      return res
        .status(400)
        .json({ message: "Barang dengan nama ini sudah ada" });
    }

    const kategori = await Kategori.findOne({ kode_kategori });
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    const barangCount = await Barang.countDocuments({
      kategori_id: kategori._id,
    });
    const kodeBarang = `${kategori.kode_kategori}-${String(
      barangCount + 1
    ).padStart(3, "0")}`;

    const barang = new Barang({
      kode_barang: kodeBarang,
      nama,
      kategori_id: kategori._id,
      stok,
      satuan_pembelian,
      harga_beli,
      harga_jual,
    });

    await barang.save();

    const barangWithKategori = await Barang.findById(barang._id).populate(
      "kategori_id",
      "nama_kategori"
    );

    // Menambahkan log aktivitas dengan userId dan username
    await LogActivity.create({
      action: "CREATE",
      entity: "barang",
      entityId: barang._id,
      description: `Barang '${nama}' berhasil ditambahkan dengan kode ${kodeBarang}`,
      details: {
        stok,
        satuan_pembelian,
        harga_beli,
        harga_jual,
      },
      status: "success",
      userId: userId,
    });

    res.status(201).json({
      message: "Barang berhasil ditambahkan",
      data: {
        ...barangWithKategori.toObject(),
        nama_kategori: barangWithKategori.kategori_id.nama_kategori,
      },
    });
  } catch (error) {
    console.error("Error saat menambah barang:", error);

    // Menambahkan log aktivitas saat error terjadi
    await LogActivity.create({
      action: "ERROR",
      entity: "barang",
      description: `Gagal menambah barang: ${error.message}`,
      details: { error: error.message },
      status: "failure",
      userId: req.user._id,
    });

    res
      .status(500)
      .json({ message: "Gagal menambah barang", error: error.message });
  }
};

// Ambil semua barang
exports.getAllBarang = async (req, res) => {
  try {
    const barang = await Barang.find().populate(
      "kategori_id",
      "nama_kategori kode_kategori"
    );

    res.status(200).json(barang);
  } catch (error) {
    console.error("Error saat mengambil semua barang:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data barang", error: error.message });
  }
};

// Ambil detail barang berdasarkan ID
exports.getBarangById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const barang = await Barang.findById(id).populate(
      "kategori_id",
      "nama_kategori kode_kategori"
    );

    if (!barang) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    await LogActivity.create({
      action: "READ",
      entity: "barang",
      entityId: id,
      description: `Detail barang dengan ID ${id} berhasil diambil`,
      status: "success",
      userId: req.user._id,
    });

    res.status(200).json(barang);
  } catch (error) {
    console.error("Error saat mengambil detail barang:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil detail barang", error: error.message });
  }
};

// Update barang berdasarkan ID
exports.updateBarang = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const {
      nama,
      kategori_kode,
      stok,
      satuan_pembelian,
      harga_beli,
      harga_jual,
    } = req.body;

    let kategoriId;
    if (kategori_kode) {
      const kategori = await Kategori.findOne({ kode_kategori: kategori_kode });
      if (!kategori) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }
      kategoriId = kategori._id;
    }

    const barang = await Barang.findByIdAndUpdate(
      id,
      {
        nama,
        kategori_id: kategoriId,
        stok,
        satuan_pembelian,
        harga_beli,
        harga_jual,
      },
      { new: true }
    );

    if (!barang) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    await LogActivity.create({
      action: "UPDATE",
      entity: "barang",
      entityId: id,
      description: `Barang dengan ID ${barang.kode_barang} berhasil diperbarui`,
      details: {
        stok,
        satuan_pembelian,
        harga_beli,
        harga_jual,
      },
      status: "success",
      userId: req.user._id,
    });

    res
      .status(200)
      .json({ message: "Barang berhasil diperbarui", data: barang });
  } catch (error) {
    console.error("Error saat memperbarui barang:", error);
    res
      .status(500)
      .json({ message: "Gagal memperbarui barang", error: error.message });
  }
};

// Hapus barang berdasarkan ID
exports.deleteBarang = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const barang = await Barang.findByIdAndDelete(id);

    if (!barang) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    await LogActivity.create({
      action: "DELETE",
      entity: "barang",
      entityId: id,
      description: `Barang dengan ID ${barang.kode_barang} berhasil dihapus`,
      status: "success",
      userId: req.user._id,
    });

    res.status(200).json({ message: "Barang berhasil dihapus", data: barang });
  } catch (error) {
    console.error("Error saat menghapus barang:", error);
    res
      .status(500)
      .json({ message: "Gagal menghapus barang", error: error.message });
  }
};
