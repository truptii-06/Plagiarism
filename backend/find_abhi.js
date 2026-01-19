const mongoose = require("mongoose");
const Student = require("./models/Student");

async function findUser() {
    try {
        await mongoose.connect("mongodb+srv://testuser:vRFjOSHi5chpturJ@cluster0.e3ihy.mongodb.net/beproject?retryWrites=true&w=majority&appName=Cluster0");
        const user = await Student.findOne({ username: "Abhi@123" });
        console.log("Found User:", user);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

findUser();
