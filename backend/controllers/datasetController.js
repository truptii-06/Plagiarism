const ReferenceDataset = require("../models/ReferenceDataset");
const ReferenceItem = require("../models/ReferenceItem");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

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
        const data = xlsx.utils.sheet_to_json(range);

        if (!data.length) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "The uploaded file is empty" });
        }

        // Create Dataset record
        const dataset = await ReferenceDataset.create({
            name,
            fileName: file.name,
            fileUrl,
            teacherId,
            rowCount: data.length
        });

        // Extract text content from rows. 
        // We assume the text is in the first column or we join all columns if multiple.
        const items = data.map((row, index) => {
            const content = Object.values(row).join(" ").trim();
            return {
                datasetId: dataset._id,
                content,
                sourceInfo: `Row ${index + 2} of ${file.name}`,
                teacherId
            };
        });

        // Bulk insert items for better performance
        await ReferenceItem.insertMany(items.filter(item => item.content.length > 5));

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
