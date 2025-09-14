import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role")?.trim();
    const userEmail = localStorage.getItem("email")?.toLowerCase();

    if (!userRole || !userEmail) {
      navigate("/login"); 
      return;
    }

    // Allowed admins
    const adminEmails = ["sanika@gmail.com", "vrushali@gmail.com", "trupti@gmail.com"];

    // Block unauthorized admins
    if (userRole === "admin" && !adminEmails.includes(userEmail)) {
      navigate("/login");
      return;
    }

    setRole(userRole);
    setEmail(userEmail);
  }, [navigate]);

  if (!role) return <div>Loading...</div>;

  return (
    <>
      {role === "teacher" && <TeacherDashboard />}
      {role === "student" && <StudentDashboard />}
      {role === "admin" && <AdminDashboard />}
    </>
  );
};

export default Dashboard;
