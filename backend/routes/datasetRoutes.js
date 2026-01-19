const express = require("express");
const router = express.Router();
const datasetController = require("../controllers/datasetController");

router.post("/upload", datasetController.uploadDataset);
router.get("/", datasetController.getDatasets);
router.delete("/:id", datasetController.deleteDataset);

module.exports = router;
