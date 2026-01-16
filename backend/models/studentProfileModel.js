const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fullName: String,
  studentId: String,
  groupId: String,
  members: [String],
  profileType: { type: String, enum: ["Individual", "Group"], default: "Individual" },
  guideName: { type: String, default: "" }
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
