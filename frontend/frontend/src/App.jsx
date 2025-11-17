import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Signup from "./components/Signup/Signup";   
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Services from "./components/Services/Services";
import Student from "./components/Student/Student";
import Teacher from "./components/Teacher/Teacher";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
      </Routes>
    </Router>
  );
};

export default App;
