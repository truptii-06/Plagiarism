const Submission = require("../models/submission");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

exports.processPlagiarismCheck = async (submissionId) => {
  const sub = await Submission.findById(submissionId);
  if (!sub) throw new Error("Submission not found");

  // ✅ FIX: use correct field name from DB
  const filePath = path.resolve(sub.fileUrl);

  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Uploaded file not found on server: ${filePath}`);
  }

  // ✅ Fetch Reference Items for comparison
  const ReferenceItem = require("../models/ReferenceItem");
  const extraItems = await ReferenceItem.find({}, "content sourceInfo metadata");

  let extraDatasetPath = "";
  if (extraItems.length > 0) {
    const tempDir = path.join(__dirname, "../python/temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    extraDatasetPath = path.join(tempDir, `dataset_${Date.now()}_${submissionId}.json`);
    fs.writeFileSync(extraDatasetPath, JSON.stringify(extraItems));
  }

  // Python script path
  const pyScript = path.join(__dirname, "../python/Plagiarism_check.py");

  const pyArgs = [pyScript, filePath];
  if (extraDatasetPath) pyArgs.push(extraDatasetPath);

  return new Promise((resolve, reject) => {
    const py = spawn("python", pyArgs);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", async (code) => {
      // Cleanup extra dataset temp file
      if (extraDatasetPath && fs.existsSync(extraDatasetPath)) {
        fs.unlinkSync(extraDatasetPath);
      }

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
          return reject(new Error(result.message));
        }

        // Save results to DB
        sub.similarity = result.similarity;
        sub.mostSimilarDoc = result.most_similar_doc || null;
        sub.matchedSnippet = result.matched_snippet || null;

        // Map match_index to metadata (handling offset from local files)
        const localCount = result.local_count || 0;
        const adjustedIndex = result.match_index - localCount;

        if (adjustedIndex >= 0 && extraItems[adjustedIndex]) {
          sub.matchedMetadata = extraItems[adjustedIndex].metadata;
          result.matchedMetadata = extraItems[adjustedIndex].metadata;
        }

        sub.status = "Pending"; // Ensure status stays pending for review

        await sub.save();

        resolve(result);
      } catch (err) {
        console.error("❌ JSON PARSE ERROR:", err);
        console.error("RAW OUTPUT:", output);
        reject(new Error("Invalid JSON returned by Python or Processing Error"));
      }
    });
  });
};

exports.runPlagiarism = async (req, res) => {
  try {
    const { submissionId } = req.body;

    if (!submissionId)
      return res.status(400).json({ error: "submissionId required" });

    const result = await exports.processPlagiarismCheck(submissionId);

    return res.json({
      success: true,
      result,
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || "Server crashed" });
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

exports.generateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const PDFDocument = require("pdfkit");
    const Submission = require("../models/submission");
    const Student = require("../models/Student");

    const sub = await Submission.findById(id);
    if (!sub) return res.status(404).json({ error: "Submission not found" });

    const student = await Student.findById(sub.studentId);

    const doc = new PDFDocument();
    let filename = `Report_${sub.projectTitle.replace(/\s+/g, "_")}.pdf`;

    // Set response headers
    res.setHeader("Content-disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // Styling
    doc.fontSize(25).text("Plagiarism Detection Report", { align: "center", underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Project Title: ${sub.projectTitle}`);
    doc.text(`Student/Group: ${sub.studentName || student?.username || "N/A"}`);
    doc.text(`Submission ID: ${sub.customStudentId || sub.customGroupId || sub._id}`);
    doc.text(`Date of Submission: ${new Date(sub.date).toLocaleDateString()}`);
    doc.text(`Status: ${sub.status}`);
    doc.moveDown();

    doc.fontSize(18).text("Analysis Summary", { underline: true });
    doc.moveDown(0.5);

    const similarity = sub.similarity || 0;
    const similarityColor = similarity > 50 ? "#f43f5e" : (similarity > 20 ? "#fbbf24" : "#10b981");
    doc.fontSize(14).fillColor(similarityColor).text(`Overall Similarity Score: ${similarity}%`, { stroke: true });
    doc.fillColor("black");
    doc.text(`Most Similar Content Found In: ${sub.mostSimilarDoc || "None"}`);
    if (sub.grammarIssues !== null) {
      doc.text(`Grammar Issues Found: ${sub.grammarIssues}`);
    }
    doc.moveDown();

    doc.fontSize(18).text("Teacher Feedback", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(sub.teacherFeedback || "No feedback provided yet.");

    doc.moveDown(2);
    doc.fontSize(10).fillColor("#666666").text("Generated by PlagiX System", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("Report Generation Error:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};

exports.runCEICheck = async (req, res) => {
  try {
    const { submissionId } = req.body;
    const path = require("path");
    const fs = require("fs");
    const { spawn } = require("child_process");
    const Submission = require("../models/submission");
    const CodeSubmission = require("../models/CodeSubmission");

    if (!submissionId) {
      return res.status(400).json({ error: "submissionId required" });
    }

    // 1. Try finding in CodeSubmission (New System)
    let sub = await CodeSubmission.findById(submissionId);

    // 2. Fallback to Report Submission (Old System or mixed use)
    if (!sub) {
      sub = await Submission.findById(submissionId);
    }

    if (!sub) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const filePath = path.resolve(sub.fileUrl);

    // Validate file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        error: "Uploaded file not found on server",
        path: filePath
      });
    }

    // Python script path
    const pyScript = path.join(__dirname, "../python/cei_detector.py");

    // Spawn python process
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
        console.error("🔥 PYTHON ERROR (CEI):", errorOutput);
      }

      try {
        // Find JSON in output
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in python output: " + output);
        }

        const result = JSON.parse(jsonMatch[0]);

        if (result.error) {
          return res.status(400).json({ error: result.error });
        }

        // Save results to DB
        sub.ceiScore = result.CEI_score;
        sub.ceiLabel = result.label;
        sub.ceiMetrics = result.metrics;

        await sub.save();

        return res.json({
          success: true,
          result
        });

      } catch (err) {
        console.error("❌ JSON PARSE ERROR (CEI):", err);
        return res.status(500).json({
          error: "Invalid JSON returned by CEI check",
          rawOutput: output,
          pythonError: errorOutput
        });
      }
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed during CEI check" });
  }
};


