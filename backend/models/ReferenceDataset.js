const mongoose = require("mongoose");

const referenceDatasetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    uploadDate: { type: Date, default: Date.now },
    rowCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("ReferenceDataset", referenceDatasetSchema);
