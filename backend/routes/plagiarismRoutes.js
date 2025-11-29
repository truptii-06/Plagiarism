const express = require("express");
const router = express.Router();
const { runPlagiarism } = require("../controllers/plagiarismController");

router.post("/check", runPlagiarism);

module.exports = router;
