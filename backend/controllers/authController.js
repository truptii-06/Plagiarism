const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// Register Student
const registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, username, password, email, phone } = req.body;

    if (!firstName || !lastName || !username || !password || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await Student.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      email,
      phone,
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully!" });

  } catch (err) {
    console.error("❌ Error while registering student:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

// Register Teacher
const registerTeacher = async (req, res) => {
  try {
    const { teacherName, organization, username, password, email, phone } = req.body;

    if (!teacherName || !organization || !username || !password || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await Teacher.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      teacherName,
      organization,
      username,
      password: hashedPassword,
      email,
      phone,
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher registered successfully!" });

  } catch (err) {
    console.error("❌ Error while registering teacher:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

// Login Controller (FIXED)
const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: "Username, password, and role are required" });
    }

    let Model;

    if (role === "student") {
      Model = Student;
    } else if (role === "teacher") {
      Model = Teacher;
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await Model.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
  message: "Login successful",
  token,
  user: {
    id: user._id,         // << IMPORTANT
    username: user.username,
    email: user.email,
    role
  }
});

  } catch (err) {
    console.error("Error while logging in:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerStudent, registerTeacher, login };
