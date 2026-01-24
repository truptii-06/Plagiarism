const mongoose = require("mongoose");

const referenceItemSchema = new mongoose.Schema({
    datasetId: { type: mongoose.Schema.Types.ObjectId, ref: "ReferenceDataset", required: true },
    content: { type: String, required: true },
    sourceInfo: { type: String }, // e.g. "Row 5 of student_data_2023.csv"
    metadata: { type: Object, default: {} },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }
});

// Index for better searching if needed
referenceItemSchema.index({ content: "text" });

module.exports = mongoose.model("ReferenceItem", referenceItemSchema);
