const express = require("express");
const router = express.Router();
const { saveProfile, getProfile } = require("../controllers/studentProfileController");

// SAVE profile
router.post("/profile/save", saveProfile);

// GET profile
router.get("/profile/:userId", getProfile);

module.exports = router;
