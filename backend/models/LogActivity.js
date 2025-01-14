const mongoose = require("mongoose");
const User = require("./User");

const LogActivitySchema = new mongoose.Schema({
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: false },
  description: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed, required: false },
  ipAddress: { type: String, required: false },
  status: {
    type: String,
    enum: ["success", "failure"],
    default: "success",
  }, // Status dari aksi (sukses atau gagal)
  timestamp: { type: Date, default: Date.now },
  additionalInfo: { type: mongoose.Schema.Types.Mixed, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Tambahkan virtual untuk mendapatkan username dari userId
LogActivitySchema.virtual("username", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("LogActivity", LogActivitySchema);
