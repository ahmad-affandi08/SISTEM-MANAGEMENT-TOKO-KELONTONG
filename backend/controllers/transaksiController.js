const Transaksi = require("../models/Transaksi");
const Barang = require("../models/Barang");
const LogActivity = require("../models/LogActivity");

// Buat Transaksi
exports.createTransaksi = async (req, res) => {
  try {
    const { kasir, barang, uang_diterima } = req.body;

    if (!barang || barang.length === 0) {
      return res.status(400).json({ message: "Barang tidak boleh kosong" });
    }

    let total = 0;
    const transaksiBarang = [];

    // Validasi setiap barang
    for (const item of barang) {
      const { barang_id, jumlah } = item;
      const barangData = await Barang.findById(barang_id);

      if (!barangData) {
        return res
          .status(404)
          .json({ message: `Barang dengan ID ${barang_id} tidak ditemukan` });
      }

      const subtotal = jumlah * barangData.harga_jual;
      total += subtotal;

      transaksiBarang.push({
        barang_id: barang_id,
        nama_barang: barangData.nama,
        jumlah,
        harga_satuan: barangData.harga_jual,
        subtotal,
      });

      // Update stok barang
      barangData.stok -= jumlah;
      if (barangData.stok < 0) {
        return res.status(400).json({
          message: `Stok barang ${barangData.nama} tidak mencukupi`,
        });
      }
      await barangData.save();
    }

    const kembalian = uang_diterima - total;

    if (kembalian < 0) {
      return res
        .status(400)
        .json({ message: "Uang diterima kurang dari total transaksi" });
    }

    const transaksi = new Transaksi({
      tanggal: new Date(),
      kasir,
      barang: transaksiBarang,
      total,
      uang_diterima,
      kembalian,
    });

    await transaksi.save();

    // Menambahkan log aktivitas saat transaksi dibuat
    await LogActivity.create({
      action: "CREATE",
      entity: "transaksi",
      entityId: transaksi._id,
      description: `Transaksi dengan total Rp${total} berhasil dibuat oleh kasir ${kasir}`,
      details: {
        barang: transaksiBarang,
        total,
        uang_diterima,
        kembalian,
      },
      status: "success",
      userId: req.user._id,
    });

    res.status(201).json({ message: "Transaksi berhasil dibuat", transaksi });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
};

// Ambil Semua Transaksi
exports.getAllTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.find().sort({ createdAt: -1 });

    // Menambahkan log aktivitas saat mengambil semua transaksi
    await LogActivity.create({
      action: "READ",
      entity: "transaksi",
      entityId: "all",
      description: `Semua transaksi berhasil diambil`,
      status: "success",
      userId: req.user._id,
    });

    res.status(200).json(transaksi);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
};

// Ambil Transaksi Berdasarkan ID
exports.getTransaksiById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaksi = await Transaksi.findById(id);
    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    // Menambahkan log aktivitas saat mengambil transaksi berdasarkan ID
    await LogActivity.create({
      action: "READ",
      entity: "transaksi",
      entityId: id,
      description: `Transaksi dengan ID ${id} berhasil diambil`,
      status: "success",
      userId: req.user._id,
    });

    res.status(200).json(transaksi);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
};

// Hapus Transaksi
exports.deleteTransaksi = async (req, res) => {
  try {
    const { id } = req.params;
    const transaksi = await Transaksi.findByIdAndDelete(id);
    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    // Menambahkan log aktivitas saat transaksi dihapus
    await LogActivity.create({
      action: "DELETE",
      entity: "transaksi",
      entityId: id,
      description: `Transaksi dengan ID ${id} berhasil dihapus`,
      status: "success",
      userId: req.user._id,
    });

    res.status(200).json({ message: "Transaksi berhasil dihapus", transaksi });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
};
