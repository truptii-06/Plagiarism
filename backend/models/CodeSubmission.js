const mongoose = require("mongoose");

const codeSubmissionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    projectTitle: { type: String, required: true },
    description: { type: String },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // Path to the uploaded code file

    // Group/Individual logic matched with main Submission model for consistency
    submissionType: { type: String, enum: ["Individual", "Group"], default: "Individual" },
    customStudentId: { type: String, default: null },
    customGroupId: { type: String, default: null },

    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
        default: "Pending",
    },

    // CEI Specific Fields
    ceiScore: { type: Number, default: null },
    ceiLabel: { type: String, default: null },
    ceiMetrics: { type: Object, default: {} },

    teacherFeedback: { type: String, default: "" },
});

module.exports = mongoose.model("CodeSubmission", codeSubmissionSchema);
