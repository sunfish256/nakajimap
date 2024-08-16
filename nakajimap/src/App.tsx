import React from "react"
import Home from "./pages/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Auth } from "./pages/Auth"
import { AuthProvider } from "./AuthContext"
import Favorite from "./pages/Favorite"
import FavoriteCondition from "./pages/FavoriteCondition"
import AuthLayout from "./components/AuthLayout"
import HomeLayout from "./components/HomeLayout"
import FavoriteConditionLayout from "./components/FavoriteConditionLayout"
import FavoriteLayout from "./components/FavoriteLayout"

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthLayout>
                <Auth />
              </AuthLayout>
            }
          />
          <Route
            path="/home"
            element={
              <HomeLayout>
                <Home />
              </HomeLayout>
            }
          />
          <Route
            path="/favorite_condition"
            element={
              <FavoriteConditionLayout>
                <FavoriteCondition />
              </FavoriteConditionLayout>
            }
          />
          <Route
            path="/favorite"
            element={
              <FavoriteLayout>
                <Favorite />
              </FavoriteLayout>
            }
          />
          <Route
            path="/"
            element={
              <AuthLayout>
                <Auth />
              </AuthLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
