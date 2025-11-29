const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadSubmission, getStudentSubmissions, getAllSubmissions, updateStatus } = require("../controllers/submissionController");

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/student_files")),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random()*1e9);
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadSubmission);
router.get("/student/:studentId", getStudentSubmissions);
router.get("/all", getAllSubmissions);
router.put("/status/:id", updateStatus);

module.exports = router;
