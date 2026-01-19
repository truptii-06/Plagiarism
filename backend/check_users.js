const mongoose = require("mongoose");
const Student = require("./models/Student");
const Teacher = require("./models/Teacher");

async function checkUsers() {
    try {
        await mongoose.connect("mongodb+srv://testuser:vRFjOSHi5chpturJ@cluster0.e3ihy.mongodb.net/beproject?retryWrites=true&w=majority&appName=Cluster0");
        const students = await Student.find({}, "username email");
        const teachers = await Teacher.find({}, "username email");

        console.log("Students:", students);
        console.log("Teachers:", teachers);

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUsers();
