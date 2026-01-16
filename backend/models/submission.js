const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  projectTitle: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },

  // New Fields for Group/Individual logic
  submissionType: { type: String, enum: ["Individual", "Group"], default: "Individual" },
  customStudentId: { type: String, default: null }, // e.g. ST2024001
  customGroupId: { type: String, default: null },   // e.g. GRP-05
  date: { type: Date, default: Date.now },

  similarity: { type: Number, default: null },
  grammarIssues: { type: Number, default: null },
  mostSimilarDoc: { type: String, default: null },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  },

  teacherFeedback: { type: String, default: "" }
});

module.exports = mongoose.model("Submission", submissionSchema);
