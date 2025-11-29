const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  projectTitle: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },

  // Results from Python
  similarity: { type: Number, default: null },
  grammarIssues: { type: Number, default: null },
  mostSimilarDoc: { type: String, default: null },

  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Rejected", "Needs Correction"],
    default: "Pending"
  },

  teacherFeedback: { type: String, default: "" }
});

module.exports = mongoose.model("Submission", submissionSchema);
