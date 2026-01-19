const Submission = require("../models/submission");
const Student = require("../models/Student");
const path = require("path");

exports.uploadSubmission = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const { studentId, projectTitle, description, submissionType, customId } = req.body;

    if (!studentId || !projectTitle || !submissionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const uploadDir = "./uploads";
    const path = require("path");
    const fs = require("fs");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const filePath = path.join(uploadDir, file.name);
    await file.mv(filePath);

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const sub = await Submission.create({
      studentId: student._id,
      studentName: student.firstName ? `${student.firstName} ${student.lastName || ""}`.trim() : student.username,
      projectTitle,
      description: description || "",
      submissionType,
      customStudentId: submissionType === 'Individual' ? customId : null,
      customGroupId: submissionType === 'Group' ? customId : null,
      fileName: file.name,
      fileUrl: filePath
    });

    res.json({ success: true, submission: sub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getStudentSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Student ID required" });

    // STRICT FILTER: Match the studentId field in DB
    const subs = await Submission.find({ studentId: id }).sort({ date: -1 });
    res.json(subs);
  } catch (err) {
    console.error("Fetch Student Submissions Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const StudentProfile = require("../models/studentProfileModel");
    const subs = await Submission.find().populate("studentId").sort({ date: -1 });

    const formatted = await Promise.all(
      subs.map(async (s) => {
        const profile = await StudentProfile.findOne({ userId: s.studentId?._id });

        return {
          _id: s._id,
          projectTitle: s.projectTitle,
          studentName: profile?.fullName
            ? profile.fullName
            : `${s.studentId?.firstName || ""} ${s.studentId?.lastName || ""}`,
          groupId: profile?.groupId || s.customGroupId || "-",
          similarity: s.similarity,
          status: s.status,
          teacherFeedback: s.teacherFeedback,
          grammarIssues: s.grammarIssues,
          mostSimilarDoc: s.mostSimilarDoc,
          fileName: s.fileName,
          fileUrl: s.fileUrl,
          date: s.date
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    console.error("Fetch All Submissions Error:", err);
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
