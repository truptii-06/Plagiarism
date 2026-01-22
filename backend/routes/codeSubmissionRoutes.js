const express = require("express");
const router = express.Router();
const { uploadCodeSubmission, getStudentCodeSubmissions, getAllCodeSubmissions, updateCodeStatus } = require("../controllers/codeSubmissionController");

router.post("/upload", uploadCodeSubmission);
router.get("/student/:studentId", getStudentCodeSubmissions);
router.get("/all", getAllCodeSubmissions);
router.put("/update/:id", updateCodeStatus);

module.exports = router;
