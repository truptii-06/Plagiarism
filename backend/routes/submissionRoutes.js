const express = require("express");
const router = express.Router();

const Submission = require("../models/submission");
const StudentProfile = require("../models/studentProfileModel");
const { getStudentSubmissions } = require("../controllers/submissionController");
const path = require("path");
// --------------------------
// 1) Get submissions of single student
// --------------------------
router.get("/student/:id", getStudentSubmissions);

// --------------------------
// 2) Upload new submission
// --------------------------
router.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const uploadPath = "./uploads/" + file.name;

    await file.mv(uploadPath);

    const newSubmission = await Submission.create({
      studentId: req.body.studentId,
      projectTitle: req.body.projectTitle,
      fileName: file.name,
      fileUrl: uploadPath
    });

    res.json({ success: true, submission: newSubmission });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------------
// 3) Teacher Dashboard — All submissions with Student Profile
// --------------------------
router.get("/all", async (req, res) => {
  try {
    const submissions = await Submission.find().populate("studentId");

    const formatted = await Promise.all(
      submissions.map(async (s) => {
        const profile = await StudentProfile.findOne({ userId: s.studentId?._id });

        return {
          _id: s._id,
          projectTitle: s.projectTitle,
          studentName: profile?.fullName 
            ? profile.fullName 
            : `${s.studentId?.firstName || ""} ${s.studentId?.lastName || ""}`,
          groupId: profile?.groupId || "-",
          similarity: s.similarity,
          status: s.status,
          teacherFeedback: s.teacherFeedback,
          fileName: s.fileName,
          fileUrl: s.fileUrl,
          date: s.date
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath);
});


// -----------------------------------------
// SAVE REVIEW (Teacher -> Student)
// -----------------------------------------
router.post("/review/save", async (req, res) => {
  try {
    const { id, status, feedback, similarity, grammarIssues, mostSimilarDoc } = req.body;

    const sub = await Submission.findById(id);
    if (!sub) return res.status(404).json({ error: "Submission not found" });

    sub.status = status;
    sub.teacherFeedback = feedback;
    if (similarity !== undefined) sub.similarity = similarity;
    if (grammarIssues !== undefined) sub.grammarIssues = grammarIssues;
    if (mostSimilarDoc !== undefined) sub.mostSimilarDoc = mostSimilarDoc;

    await sub.save();

    res.json({ success: true, submission: sub });

  } catch (err) {
    console.error("Review Save Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
