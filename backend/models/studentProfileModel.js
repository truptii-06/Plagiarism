const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fullName: String,
  studentId: String,
  groupId: String,
  members: [String]
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
