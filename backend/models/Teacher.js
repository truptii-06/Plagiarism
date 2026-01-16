const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  organization: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  profilePic: { type: String, default: "" },
});

module.exports = mongoose.model("Teacher", teacherSchema);
