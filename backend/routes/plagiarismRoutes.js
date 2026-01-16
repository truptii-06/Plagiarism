const express = require("express");
const router = express.Router();
const { runPlagiarism, runAICodeCheck, runTextCheck, runCodeSimilarity } = require("../controllers/plagiarismController");

router.post("/check", runPlagiarism);
router.post("/ai-check", runAICodeCheck);
router.post("/text-check", runTextCheck);
router.post("/code-similarity", runCodeSimilarity);

module.exports = router;
