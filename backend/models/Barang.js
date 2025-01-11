const mongoose = require("mongoose");

const barangSchema = new mongoose.Schema(
  {
    kode_barang: { type: String, required: true, unique: true },
    nama: { type: String, required: true },
    kategori_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kategori",
      required: true,
    },
    stok: { type: Number, required: true, default: 0 },
    satuan_pembelian: { type: String, required: true },
    isi_per_box: { type: Number, required: false },
    harga_beli: { type: Number, required: true },
    harga_jual: { type: Number, required: true },
    stok_minimum: { type: Number, required: false, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Barang", barangSchema);
