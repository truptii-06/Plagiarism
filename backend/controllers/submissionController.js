const Submission = require("../models/submission");
const Student = require("../models/Student");
const path = require("path");

exports.uploadSubmission = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { studentId, projectTitle, description } = req.body;
    if (!studentId || !projectTitle) return res.status(400).json({ error: "Missing fields" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const sub = await Submission.create({
      student: student._id,
      studentName: student.firstName ? `${student.firstName} ${student.lastName || ""}`.trim() : student.username,
      projectTitle,
      description: description || "",
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
