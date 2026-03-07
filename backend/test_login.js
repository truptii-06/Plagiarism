const axios = require("axios");

async function testLogin() {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      username: "Gajanan@123",
      password: "Gajanan@123", // testing likely passwords based on username
      role: "student"
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
  }
}

testLogin();
