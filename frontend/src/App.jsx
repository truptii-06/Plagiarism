// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage.jsx';
import Signup from './components/Signup/Signup.jsx';
import Student from './components/Student/Student.jsx';
import Teacher from './components/Teacher/Teacher.jsx'; // layout
import MyClasses from './components/common/MyClasses.jsx';
import Reports from './components/common/Reports.jsx';
import Setting from './components/common/Setting.jsx';
import StudentDashboard from './components/common/StudentDashboard.jsx';
import TeacherDashboard from './components/common/TeacherDashboard.jsx'; // teacher content

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />

        {/* student layout + nested routes */}
        <Route path="/student" element={<Student />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="my-classes" element={<MyClasses />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Setting />} />
        </Route>

        {/* teacher layout (Teacher.jsx) as the layout. Nested teacher pages below */}
        <Route path="/teacher" element={<Teacher />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="my-classes" element={<MyClasses />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Setting />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
