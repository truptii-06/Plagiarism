const bcrypt = require("bcryptjs");
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
    // send actual error
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

// ✅ Login Controller
const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // find user with matching username + role
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or role" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { registerStudent, registerTeacher,login };
