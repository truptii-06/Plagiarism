import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './components/Homepage/Homepage'
import Loginpage from './components/Loginpage/Loginpage'
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Loginpage" element={<Loginpage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
