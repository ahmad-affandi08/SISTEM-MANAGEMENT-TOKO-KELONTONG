// models/Karyawan.js
const mongoose = require("mongoose");

const karyawanSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    alamat: {
      type: String,
      required: true,
    },
    telepon: {
      type: String,
      required: true,
    },
    tanggalLahir: {
      type: Date,
      required: true,
    },
    jenisKelamin: {
      type: String,
      enum: ["Laki-laki", "Perempuan"],
      required: true,
    },
    statusPekerjaan: {
      type: String,
      enum: ["Aktif", "Non-Aktif"],
      default: "Aktif",
    },
    tanggalMulaiKerja: {
      type: Date,
      required: true,
    },
    gaji: {
      type: Number,
      required: true,
    },
    shift: {
      type: String,
      enum: ["Pagi", "Siang", "Malam"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fotoProfil: {
      type: String,
      default: "default.jpg",
    },
    catatan: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Karyawan = mongoose.model("Karyawan", karyawanSchema);
module.exports = Karyawan;
