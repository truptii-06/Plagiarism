const Submission = require("../models/submission");
const { spawn } = require("child_process");
const path = require("path");

exports.runPlagiarism = async (req, res) => {
  try {
    const { submissionId } = req.body;

    if (!submissionId)
      return res.status(400).json({ error: "submissionId required" });

    const sub = await Submission.findById(submissionId);
    if (!sub)
      return res.status(404).json({ error: "Submission not found" });

    // ✅ FIX: use correct field name from DB
    const filePath = path.resolve(sub.fileUrl);

    // Validate file exists
    const fs = require("fs");
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        error: "Uploaded file not found on server",
        path: filePath
      });
    }

    // Python script path
    const pyScript = path.join(__dirname, "../python/Plagiarism_check.py");

    const py = spawn("python", [pyScript, filePath]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", async (code) => {
      if (errorOutput) {
        console.error("🔥 PYTHON ERROR:", errorOutput);
      }

      try {
        const result = JSON.parse(output);

        // Save results to DB
        sub.similarity = result.similarity;
        sub.mostSimilarDoc = result.most_similar_doc || null;
        sub.status = "Reviewed";

        await sub.save();

        return res.json({
          success: true,
          result,
        });
      } catch (err) {
        console.error("❌ JSON PARSE ERROR:", err);
        console.error("RAW OUTPUT:", output);

        return res.status(500).json({
          error: "Invalid JSON returned by Python",
          rawOutput: output,
          pythonError: errorOutput,
        });
      }
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed" });
  }
};
