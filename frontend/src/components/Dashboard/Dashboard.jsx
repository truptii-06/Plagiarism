import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role")?.trim(); // get role from storage
    const userEmail = localStorage.getItem("email");

    if (!userRole || !userEmail) {
      navigate("/login"); // redirect to login if not logged in
      return;
    }

    setRole(userRole); // set role to state
  }, [navigate]);

  if (!role) return <div>Loading...</div>; // show loading while fetching role

  return (
    <>
      {role === "teacher" && <TeacherDashboard />}
      {role === "student" && <StudentDashboard />}
    </>
  );
};

export default Dashboard;
