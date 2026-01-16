const Submission = require("../models/submission");
const Student = require("../models/Student");
const path = require("path");

exports.uploadSubmission = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { studentId, projectTitle, description, submissionType, customId } = req.body;

    if (!studentId || !projectTitle || !submissionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // DUPLICATE CHECK
    let duplicateQuery = {};
    let idField = "";

    if (submissionType === "Group") {
      if (!customId) return res.status(400).json({ error: "Group ID is required for group projects" });
      duplicateQuery = { customGroupId: customId, projectTitle };
      idField = `Group ID ${customId}`;
    } else {
      // Individual
      // Use customId if provided (Student ID), otherwise we might just check mongo studentId + project
      if (!customId) return res.status(400).json({ error: "Student ID is required for individual projects" });
      duplicateQuery = { customStudentId: customId, projectTitle };
      idField = `Student ID ${customId}`;
    }

    // Check if submission already exists
    const existing = await Submission.findOne(duplicateQuery);
    if (existing) {
      // Optional: Allow re-submission if Rejected?
      if (existing.status !== 'Rejected' && existing.status !== 'Needs Correction') {
        return res.status(400).json({ error: `A submission for ${idField} with title "${projectTitle}" already exists.` });
      }
      // If rejected, maybe we proceed to create NEW one or update old? 
      // User asked to clear duplicates, so let's prevent creating new implementation
      // We'll proceed to create a NEW record but maybe we should archive the old one?
      // For simplicity, let's just block if Pending/Reviewed 
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const sub = await Submission.create({
      student: student._id,
      studentName: student.firstName ? `${student.firstName} ${student.lastName || ""}`.trim() : student.username,
      projectTitle,
      description: description || "",
      submissionType,
      customStudentId: submissionType === 'Individual' ? customId : null,
      customGroupId: submissionType === 'Group' ? customId : null,
      fileName: req.file.originalname,
      filePath: req.file.path
    });

    res.json({ success: true, submission: sub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getStudentSubmissions = async (req, res) => {
  try {
    const subs = await Submission.find({ student: req.params.studentId }).sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const subs = await Submission.find().populate("student", "username email").sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // { status, teacherFeedback, similarity, grammarIssues }
    const sub = await Submission.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, submission: sub });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
