import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./components/Homepage/Homepage.jsx";
import Signup from "./components/Signup/Signup.jsx";

import Student from "./components/Student/Student.jsx";
import Teacher from "./components/Teacher/Teacher.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Dashboard */}
        <Route path="/student/*" element={<Student />} />

        {/* Teacher Dashboard */}
        <Route path="/teacher/*" element={<Teacher />} />

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
