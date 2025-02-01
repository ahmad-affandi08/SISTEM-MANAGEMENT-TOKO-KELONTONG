const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Sesuaikan dengan origin frontend Anda
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use(express.json());

// Import routes
const barangRoutes = require("./routes/barangRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const laporanRoutes = require("./routes/laporanRoutes");
const authRoutes = require("./routes/authRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");
const logRoutes = require("./routes/logRoutes");
const userRoutes = require("./routes/userRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Use routes
app.use("/api/laporan", laporanRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/barang", barangRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/users", userRoutes);
app.use("/api/karyawan", karyawanRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
