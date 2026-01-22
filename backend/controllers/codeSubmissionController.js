const CodeSubmission = require("../models/CodeSubmission");
const StudentProfile = require("../models/studentProfileModel");

// Upload Code Submission
exports.uploadCodeSubmission = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.files.file;
        const { studentId, projectTitle, description, submissionType, customId } = req.body;

        if (!studentId || !projectTitle || !submissionType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Save file
        const uploadPath = `./uploads/code/${file.name}`;
        // Ensure dir exists (simplified, assuming uploads exists or let mv handle it)
        // Note: User might need to ensure 'uploads/code' exists, but we'll use top level uploads for simplicity matching existing flow
        // or separate valid folder. Let's use ./uploads/ for now to avoid FS errors if dir missing.
        const savePath = `./uploads/${file.name}`;

        file.mv(savePath, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

            const newSub = await CodeSubmission.create({
                studentId,
                projectTitle,
                description: description || "",
                submissionType,
                customStudentId: submissionType === 'Individual' ? customId : null,
                customGroupId: submissionType === 'Group' ? customId : null,
                fileName: file.name,
                fileUrl: savePath,
                status: "Pending"
            });

            res.status(201).json({ success: true, submission: newSub });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get Student's Code Submissions
exports.getStudentCodeSubmissions = async (req, res) => {
    try {
        const { studentId } = req.params;
        const subs = await CodeSubmission.find({ studentId }).sort({ date: -1 });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get ALL Code Submissions (For Teacher)
exports.getAllCodeSubmissions = async (req, res) => {
    try {
        const subs = await CodeSubmission.find().populate("studentId").sort({ date: -1 });

        const formatted = await Promise.all(
            subs.map(async (s) => {
                const profile = await StudentProfile.findOne({ userId: s.studentId?._id });

                return {
                    _id: s._id,
                    projectTitle: s.projectTitle,
                    studentName: profile?.fullName
                        ? profile.fullName
                        : `${s.studentId?.firstName || ""} ${s.studentId?.lastName || ""}`,
                    groupId: profile?.groupId || s.customGroupId || "-",
                    status: s.status,
                    teacherFeedback: s.teacherFeedback,
                    fileName: s.fileName,
                    fileUrl: s.fileUrl,
                    date: s.date,
                    ceiScore: s.ceiScore,
                    ceiLabel: s.ceiLabel,
                    ceiMetrics: s.ceiMetrics
                };
            })
        );

        res.json(formatted);
    } catch (err) {
        console.error("Fetch All Code Submissions Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update Status (Teacher Review)
exports.updateCodeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // { status, teacherFeedback }
        const sub = await CodeSubmission.findByIdAndUpdate(id, updates, { new: true });
        res.json({ success: true, submission: sub });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
