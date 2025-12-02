const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const plagiarismRoutes = require("./routes/plagiarismRoutes");
const studentProfileRoutes = require("./routes/studentprofileRoutes");

dotenv.config();
connectDB();

const app = express(); // ✅ MUST COME FIRST

// Middleware
app.use(express.json());                            // JSON parsing
app.use(express.urlencoded({ extended: true }));     // Form data parsing
app.use(cors());
app.use(fileUpload());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/plagiarism", plagiarismRoutes);
app.use("/api/student", studentProfileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
