const mongoose = require("mongoose");

const kategoriSchema = new mongoose.Schema(
  {
    kode_kategori: { type: String, required: true, unique: true },
    nama_kategori: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kategori", kategoriSchema);
