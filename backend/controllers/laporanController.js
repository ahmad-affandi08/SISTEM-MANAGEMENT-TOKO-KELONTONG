const Transaksi = require("../models/Transaksi");
const Barang = require("../models/Barang");
const Kategori = require("../models/Kategori");

const generateLaporan = async (req, res) => {
  try {
    // Ambil semua transaksi dengan data barang dan kategori
    const transaksi = await Transaksi.aggregate([
      {
        $unwind: "$barang",
      },
      {
        $lookup: {
          from: "barangs",
          localField: "barang.barang_id",
          foreignField: "_id",
          as: "barang_info",
        },
      },
      {
        $unwind: "$barang_info",
      },
      {
        $lookup: {
          from: "kategoris",
          localField: "barang_info.kategori_id",
          foreignField: "_id",
          as: "kategori_info",
        },
      },
      {
        $unwind: "$kategori_info",
      },
      {
        $group: {
          _id: "$_id",
          tanggal: { $first: "$tanggal" },
          kasir: { $first: "$kasir" },
          barang_terjual: {
            $push: {
              barang_id: "$barang_info._id",
              nama_barang: "$barang_info.nama",
              kategori: "$kategori_info.nama_kategori",
              jumlah: "$barang.jumlah",
              harga_satuan: "$barang.harga_satuan",
              subtotal: "$barang.subtotal",
            },
          },
          total_transaksi: { $first: "$total" },
          total_pendapatan: { $first: "$total" },
          uang_diterima: { $first: "$uang_diterima" },
          kembalian: { $first: "$kembalian" },
        },
      },
      // Perhitungan pendapatan per kategori
      {
        $project: {
          tanggal: 1,
          kasir: 1,
          total_transaksi: 1,
          total_pendapatan: 1,
          uang_diterima: 1,
          kembalian: 1,
          barang_terjual: 1,
          total_kategori: {
            $map: {
              input: {
                $setUnion: [
                  {
                    $map: {
                      input: "$barang_terjual",
                      as: "barang",
                      in: "$$barang.kategori",
                    },
                  },
                ],
              },
              as: "kategori",
              in: {
                kategori: "$$kategori",
                total_pendapatan_kategori: {
                  $sum: {
                    $filter: {
                      input: "$barang_terjual",
                      as: "barang",
                      cond: { $eq: ["$$barang.kategori", "$$kategori"] },
                    },
                  },
                },
                total_barang_terjual: {
                  $sum: {
                    $filter: {
                      input: "$barang_terjual",
                      as: "barang",
                      cond: { $eq: ["$$barang.kategori", "$$kategori"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    // Menyusun laporan
    const laporan = transaksi.map((item) => ({
      tanggal: new Date(item.tanggal).toISOString().split("T")[0],
      kasir: item.kasir,
      total_transaksi: item.total_transaksi,
      total_pendapatan: item.total_pendapatan,
      barang_terjual: item.barang_terjual,
      uang_diterima: item.uang_diterima,
      kembalian: item.kembalian,
      total_kategori: item.total_kategori,
    }));

    return res.status(200).json(laporan);
  } catch (error) {
    console.error("Error generating laporan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateLaporan };
