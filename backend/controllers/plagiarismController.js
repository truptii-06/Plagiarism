const Submission = require("../models/submission");
const { spawn } = require("child_process");
const path = require("path");

exports.runPlagiarism = async (req, res) => {
  try {
    const { submissionId } = req.body;
    if (!submissionId) return res.status(400).json({ error: "submissionId required" });

    const sub = await Submission.findById(submissionId);
    if (!sub) return res.status(404).json({ error: "Submission not found" });

    const pyScript = path.join(__dirname, "../python/Plagiarism_check.py");
    const filePath = path.resolve(sub.filePath);

    const py = spawn("python", [pyScript, filePath]);

    let output = "", errOutput = "";
    py.stdout.on("data", (data) => output += data.toString());
    py.stderr.on("data", (d) => errOutput += d.toString());

    py.on("close", async (code) => {
      if (errOutput) console.error("PY ERR:", errOutput);
      try {
        const parsed = JSON.parse(output);
        // Save results
        sub.similarity = parsed.similarity;
        sub.grammarIssues = parsed.grammar_issues ?? parsed.grammarIssues ?? null;
        sub.mostSimilarDoc = parsed.most_similar_doc ?? parsed.mostSimilarDoc ?? null;
        sub.status = "Reviewed";
        await sub.save();
        res.json({ success: true, result: parsed });
      } catch (e) {
        console.error("Parse error", e, "raw:", output);
        res.status(500).json({ error: "Failed to parse python output", raw: output, pyErr: errOutput });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
