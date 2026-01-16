const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const path = require("path");
const fs = require("fs");

// GET profile based on role and ID
exports.getGeneralProfile = async (req, res) => {
    try {
        const { userId, role } = req.params;
        let user;

        if (role === 'student') {
            user = await Student.findById(userId).select("-password");
        } else if (role === 'teacher') {
            user = await Teacher.findById(userId).select("-password");
        } else {
            return res.status(400).json({ error: "Invalid role" });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Get General Profile Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// UPDATE profile text fields
exports.updateGeneralProfile = async (req, res) => {
    try {
        const { userId, role, firstName, lastName, phone, email, teacherName, organization } = req.body;
        let user;

        if (role === 'student') {
            user = await Student.findByIdAndUpdate(
                userId,
                { firstName, lastName, phone, email },
                { new: true }
            ).select("-password");
        } else if (role === 'teacher') {
            user = await Teacher.findByIdAndUpdate(
                userId,
                { teacherName, organization, phone, email },
                { new: true }
            ).select("-password");
        } else {
            return res.status(400).json({ error: "Invalid role" });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error("Update Profile Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// UPLOAD profile picture
exports.uploadProfilePic = async (req, res) => {
    try {
        if (!req.files || !req.files.profilePic) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const { userId, role } = req.body;
        const file = req.files.profilePic;
        const ext = path.extname(file.name);
        const fileName = `${role}_${userId}${ext}`;
        const uploadPath = path.join(__dirname, "../uploads/profiles", fileName);

        await file.mv(uploadPath);

        const picUrl = `uploads/profiles/${fileName}`;

        // Update user record
        if (role === 'student') {
            await Student.findByIdAndUpdate(userId, { profilePic: picUrl });
        } else if (role === 'teacher') {
            await Teacher.findByIdAndUpdate(userId, { profilePic: picUrl });
        }

        res.json({ success: true, profilePic: picUrl });
    } catch (err) {
        console.error("Profile Pic Upload Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
