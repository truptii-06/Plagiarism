const express = require("express");
const router = express.Router();

const { getStudentSubmissions, uploadSubmission, getAllSubmissions, updateStatus } = require("../controllers/submissionController");
const path = require("path");


// 1) Get submissions of single student
router.get("/student/:id", getStudentSubmissions);

// 2) Upload new submission
router.post("/upload", uploadSubmission);

// 3) Teacher Dashboard — All submissions
router.get("/all", getAllSubmissions);

// 4) Download File
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath);
});

// 5) SAVE REVIEW (Teacher -> Student)
router.post("/review/save", updateStatus);

module.exports = router;
