import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role"); // read role from localStorage
    const userEmail = localStorage.getItem("email");

    if (!userEmail || !userRole) {
      navigate("/login");
      return;
    }

    setRole(userRole);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome to EduCheck Dashboard</h1>

      {role === "teacher" && (
        <div>
          <h2>Teacher Dashboard</h2>
          <p>Manage student submissions and generate plagiarism reports.</p>
        </div>
      )}

      {role === "student" && (
        <div>
          <h2>Student Dashboard</h2>
          <p>Submit your assignments and check originality reports.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
