const Feedback = require("../models/Feedback");

// Menambahkan kritik dan saran
exports.createFeedback = async (req, res) => {
  try {
    const { name, message } = req.body;
    const userId = req.user.id; // Ambil ID pengguna dari request yang sudah diautentikasi

    const feedback = new Feedback({ name, message, userId });
    await feedback.save();
    
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Mendapatkan semua kritik dan saran berdasarkan ID pengguna yang sedang login
exports.getAllFeedback = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil ID pengguna dari request yang sudah diautentikasi
    const feedbacks = await Feedback.find({ userId }).sort({ createdAt: -1 }); // Ambil feedback yang sesuai dengan userId

    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mendapatkan kritik dan saran berdasarkan ID dan ID pengguna yang sedang login
exports.getFeedbackById = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil ID pengguna dari request yang sudah diautentikasi
    const feedback = await Feedback.findOne({ _id: req.params.id, userId }); // Pastikan feedback milik user yang sedang login
    
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback tidak ditemukan atau tidak milik Anda" });
    }

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Menghapus kritik dan saran berdasarkan ID dan ID pengguna yang sedang login
exports.deleteFeedback = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil ID pengguna dari request yang sudah diautentikasi
    const feedback = await Feedback.findOneAndDelete({ _id: req.params.id, userId }); // Pastikan feedback yang dihapus milik user yang sedang login
    
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback tidak ditemukan atau tidak milik Anda" });
    }

    res.status(200).json({ success: true, message: "Feedback berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mendapatkan seluruh kritik dan saran (Admin)
exports.getAllFeedbacksAdmin = async (req, res) => {
    try {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // Ambil semua feedback dan urutkan berdasarkan waktu dibuat
  
      res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  