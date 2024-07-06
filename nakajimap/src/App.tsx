import React from "react"
import Home from "./pages/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Auth } from "./pages/Auth"
import FavoriteCondition from "./pages/FavoriteCondition"
import Layout from "./components/Layout"

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/favorite_condition" element={<FavoriteCondition />} />
          <Route path="/" element={<Auth />} /> {/* デフォルトはAuthに */}
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
