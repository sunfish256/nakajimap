import React from "react"
import Home from "./pages/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Auth } from "./pages/Auth"
import "./App.css"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Auth />} /> {/* デフォルトはAuthに */}
      </Routes>
    </Router>
  )
}

export default App
