const StudentProfile = require("../models/studentProfileModel");

// SAVE or UPDATE student profile
exports.saveProfile = async (req, res) => {
  try {
    const { userId, fullName, studentId, groupId, members, profileType, guideName } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { fullName, studentId, groupId, members, profileType, guideName },
      { new: true, upsert: true }
    );

    res.json({ success: true, profile });
  } catch (err) {
    console.error("Save Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET student profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await StudentProfile.findOne({ userId });

    res.json(profile || {});
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
