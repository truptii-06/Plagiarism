const Submission = require("../models/submission");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

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
        // Find JSON in output (more robust than strict parse)
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in python output");
        }
        const result = JSON.parse(jsonMatch[0]);

        if (result.status === "error") {
          return res.status(400).json({ error: result.message });
        }

        // Save results to DB
        sub.similarity = result.similarity;
        sub.mostSimilarDoc = result.most_similar_doc || null;
        // NOTE: We don't auto-set status to 'Accepted'/'Rejected' here, 
        // the teacher will do that manually on the review page.

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

exports.runAICodeCheck = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, "../uploads", file.name);

    // Save file temporarily
    await file.mv(uploadPath);

    // Python script path
    const pyScript = path.join(__dirname, "../python/AICodeDetector.py");

    const py = spawn("python", [pyScript, uploadPath]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", async (code) => {
      // Cleanup temp file
      if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);

      if (errorOutput) {
        console.error("🔥 PYTHON ERROR:", errorOutput);
        // Don't return immediately, sometimes warnings go to stderr
      }

      try {
        // Find JSON in output (handle potential extra logs)
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in python output");
        }
        const result = JSON.parse(jsonMatch[0]);

        if (result.error) {
          return res.status(400).json(result);
        }

        return res.json({
          success: true,
          result,
        });
      } catch (err) {
        console.error("❌ JSON PARSE ERROR:", err);
        console.error("RAW OUTPUT:", output);

        return res.status(500).json({
          error: "Invalid JSON returned by Python check",
          rawOutput: output,
          pythonError: errorOutput,
        });
      }
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed during AI check" });
  }
};

exports.runTextCheck = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, "../uploads", file.name);

    // Save file temporarily
    await file.mv(uploadPath);

    // Python script path
    const pyScript = path.join(__dirname, "../python/Plagiarism_check.py");

    const py = spawn("python", [pyScript, uploadPath]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", async (code) => {
      // Cleanup temp file
      if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);

      if (errorOutput) {
        console.error("🔥 PYTHON ERROR:", errorOutput);
      }

      try {
        // Find JSON in output
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in python output");
        }
        const result = JSON.parse(jsonMatch[0]);

        if (result.status === "error") {
          return res.status(400).json({ error: result.message });
        }

        return res.json({
          success: true,
          result,
        });
      } catch (err) {
        console.error("❌ JSON PARSE ERROR:", err);
        console.error("RAW OUTPUT:", output);

        return res.status(500).json({
          error: "Invalid JSON returned by Python check",
          rawOutput: output
        });
      }
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed during text check" });
  }
};

exports.runCodeSimilarity = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, "../uploads", file.name);

    // Save file temporarily
    await file.mv(uploadPath);

    // Python script path
    const pyScript = path.join(__dirname, "../python/CodeSimilarity_check.py");
    const oldDocsFolder = path.join(__dirname, "../python/data/old_docs"); // For now using same folder or student_files

    const py = spawn("python", [pyScript, uploadPath, oldDocsFolder]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", async (code) => {
      // Cleanup temp file
      if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);

      if (errorOutput) {
        console.error("🔥 PYTHON ERROR:", errorOutput);
      }

      try {
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in python output");
        }
        const result = JSON.parse(jsonMatch[0]);

        return res.json({
          success: true,
          result,
        });
      } catch (err) {
        console.error("❌ JSON PARSE ERROR:", err);
        return res.status(500).json({
          error: "Invalid JSON returned by Code Similarity check",
          rawOutput: output
        });
      }
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed during code similarity check" });
  }
};

