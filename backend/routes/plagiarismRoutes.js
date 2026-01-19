const express = require("express");
const router = express.Router();
const { runPlagiarism, runAICodeCheck, runTextCheck, runCodeSimilarity, generateReport } = require("../controllers/plagiarismController");

router.post("/check", runPlagiarism);
router.post("/ai-check", runAICodeCheck);
router.post("/text-check", runTextCheck);
router.post("/code-similarity", runCodeSimilarity);
router.get("/report/:id", generateReport);

module.exports = router;
