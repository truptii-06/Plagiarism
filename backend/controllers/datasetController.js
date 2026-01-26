const ReferenceDataset = require("../models/ReferenceDataset");
const ReferenceItem = require("../models/ReferenceItem");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const axios = require("axios");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

// Helper to extract text from URL
async function extractTextFromUrl(url) {
    try {
        if (!url || !url.startsWith("http")) return "";

        console.log(`Fetching content from: ${url}`);
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });
        const buffer = Buffer.from(response.data);
        const contentType = response.headers['content-type'];

        if (contentType && contentType.includes("application/pdf") || url.toLowerCase().endsWith(".pdf")) {
            const data = await pdf(buffer);
            return data.text;
        } else if (
            (contentType && contentType.includes("wordprocessingml")) ||
            url.toLowerCase().endsWith(".docx")
        ) {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } else {
            // Assume plain text or unknown, try to decode
            return buffer.toString('utf-8');
        }
    } catch (err) {
        console.error(`Failed to fetch/parse URL ${url}:`, err.message);
        return ""; // Fail silently so we don't break the whole upload
    }
}

exports.uploadDataset = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { name, teacherId } = req.body;
        if (!name || !teacherId) {
            return res.status(400).json({ error: "Name and Teacher ID are required" });
        }

        const file = req.files.file;
        const uploadDir = path.join(__dirname, "../uploads/datasets");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        const fileUrl = `/uploads/datasets/${fileName}`;

        await file.mv(filePath);

        // Parse the file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const range = workbook.Sheets[sheetName];

        // 1. Get raw data as array of arrays to detect header
        // 1. Get raw data as array of arrays to detect header. raw: false ensures we get formatted strings (dates as text)
        const rawRows = xlsx.utils.sheet_to_json(range, { header: 1, raw: false });

        if (!rawRows.length) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "The uploaded file is empty" });
        }

        // 2. Smart Header Detection
        let headerRowIndex = 0;
        let headers = [];

        // Look for typical academic headers in first 10 rows
        for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
            const rowStr = rawRows[i].map(c => String(c).toLowerCase().trim()).join(" ");
            if (rowStr.includes("project title") || rowStr.includes("name of the students")) {
                headerRowIndex = i;
                headers = rawRows[i].map(c => String(c).trim()); // Keep original case for mapping but trimmed
                break;
            }
        }

        // If no header found, assume row 0, but this is risky. Default to row 0 if detection fails.
        if (headers.length === 0 && rawRows.length > 0) {
            headers = rawRows[0].map(c => String(c).trim());
        }

        // Create Dataset record
        const dataset = await ReferenceDataset.create({
            name,
            fileName: file.name,
            fileUrl,
            teacherId,
            rowCount: rawRows.length - headerRowIndex - 1
        });

        // Extract text content from rows.
        const items = [];

        // Process rows starting AFTER the header
        for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
            const rowData = rawRows[i];
            if (!rowData || rowData.length === 0) continue;

            // Map row data to headers
            const rowObj = {};
            headers.forEach((h, idx) => {
                if (h) rowObj[h] = rowData[idx] || "";
            });

            // Extract relevant fields (Normalize)
            const cleanMetadata = {
                projectTitle: "",
                groupMembers: "",
                projectGuide: "",
                academicYear: "",
                problemStatement: "",
                sourceLink: ""
            };

            // Helper to find value loosely
            const findVal = (patterns) => {
                const key = Object.keys(rowObj).find(k => patterns.some(p => k.toLowerCase().includes(p.toLowerCase())));
                return key ? rowObj[key] : "";
            };

            cleanMetadata.projectTitle = findVal(["Project Title", "Title"]);
            cleanMetadata.groupMembers = findVal(["Name of the Students", "Student Name", "Group Members", "Members"]);
            cleanMetadata.projectGuide = findVal(["Guide name", "Guide"]);
            cleanMetadata.academicYear = findVal(["Year", "Publish Date", "Academic Year"]);
            // Problem statement might be "Abstract" or "Domain" if problem statement not present
            cleanMetadata.problemStatement = findVal(["Problem Statement", "Abstract", "Domain"]);

            // FIX: If academic year is looks like an Excel serial number (digits only) or is missing, 
            // try to extract it from the Dataset Name (e.g., "BE 2025-26 Reports")
            const isInvalidYear = !cleanMetadata.academicYear || /^\d{5}$/.test(String(cleanMetadata.academicYear));
            if (isInvalidYear) {
                // Try grabbing "20XX-YY" or "20XX" from the dataset name
                const yearMatch = name.match(/20\d{2}[-–]\d{2}/) || name.match(/20\d{2}/);
                if (yearMatch) {
                    cleanMetadata.academicYear = yearMatch[0];
                }
            }

            // Find link
            const rowValues = Object.values(rowObj);
            const link = rowValues.find(v => typeof v === 'string' && v.trim().match(/^https?:\/\//));
            if (link) cleanMetadata.sourceLink = link.replace(/\s/g, "");

            // Build Academic Content for TF-IDF (Ignore generic metadata)
            const academicText = [
                cleanMetadata.projectTitle,
                cleanMetadata.problemStatement,
                cleanMetadata.groupMembers,
                cleanMetadata.projectGuide
            ].filter(Boolean).join(" ");

            let additionalContent = "";

            // Check for URLs to extract full text
            if (cleanMetadata.sourceLink) {
                const extracted = await extractTextFromUrl(cleanMetadata.sourceLink.trim());
                if (extracted) {
                    additionalContent += "\n\n--- EXTRACTED FROM LINK ---\n" + extracted;
                }
            }

            // FALLBACK: If specific columns were not found, use ALL columns to ensure we index something
            if (academicText.length < 5) {
                const allValues = Object.values(rowObj).map(v => String(v).trim()).filter(v => v.length > 0 && !v.startsWith("http"));
                if (allValues.length > 0) {
                    // Filter out values that look like IDs or dates to reduce noise, but kept simple for now
                    academicText += " " + allValues.join(" ");
                }
            }

            // Only add if we have at least some content
            if (academicText.length > 2 || additionalContent.length > 5) {
                items.push({
                    datasetId: dataset._id,
                    content: (academicText + " " + additionalContent).trim(),
                    sourceInfo: `Row ${i + 1}`,
                    metadata: cleanMetadata, // Store only the clean structure
                    teacherId
                });
            }
        }

        // Bulk insert items for better performance
        // Filter empty content (though with URL extraction it might not be empty anymore)
        const validItems = items.filter(item => item.content.length > 5);
        if (validItems.length > 0) {
            await ReferenceItem.insertMany(validItems);
        }

        res.json({ success: true, dataset });
    } catch (err) {
        console.error("Dataset Upload Error:", err);
        res.status(500).json({ error: "Failed to upload and process dataset" });
    }
};

exports.getDatasets = async (req, res) => {
    try {
        const { teacherId } = req.query;
        const query = teacherId ? { teacherId } : {};
        const datasets = await ReferenceDataset.find(query).sort({ uploadDate: -1 });
        res.json(datasets);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch datasets" });
    }
};

exports.deleteDataset = async (req, res) => {
    try {
        const { id } = req.params;
        const dataset = await ReferenceDataset.findById(id);
        if (!dataset) return res.status(404).json({ error: "Dataset not found" });

        // Delete items first
        await ReferenceItem.deleteMany({ datasetId: id });

        // Delete file if it exists
        const filePath = path.join(__dirname, "..", dataset.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete metadata
        await ReferenceDataset.findByIdAndDelete(id);

        res.json({ success: true, message: "Dataset deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete dataset" });
    }
};
