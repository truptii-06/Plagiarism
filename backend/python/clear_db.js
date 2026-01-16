const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env
dotenv.config({ path: path.join(__dirname, "../.env") });

// Connect DB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    const Submission = require("../models/submission");
    try {
        await Submission.deleteMany({});
        console.log("All submissions deleted from database.");
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

run();
