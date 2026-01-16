const express = require("express");
const router = express.Router();
const { getGeneralProfile, updateGeneralProfile, uploadProfilePic } = require("../controllers/profileController");

router.get("/:role/:userId", getGeneralProfile);
router.post("/update", updateGeneralProfile);
router.post("/upload-pic", uploadProfilePic);

module.exports = router;
