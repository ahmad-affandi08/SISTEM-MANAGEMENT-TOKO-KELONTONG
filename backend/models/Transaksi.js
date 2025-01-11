const mongoose = require("mongoose");

const transaksiSchema = new mongoose.Schema(
  {
    tanggal: { type: Date, required: true, default: Date.now },
    kasir: { type: String, required: true },
    barang: [
      {
        barang_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Barang",
          required: true,
        },
        nama_barang: { type: String, required: true },
        jumlah: { type: Number, required: true },
        harga_satuan: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    uang_diterima: { type: Number, required: true },
    kembalian: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaksi", transaksiSchema);
