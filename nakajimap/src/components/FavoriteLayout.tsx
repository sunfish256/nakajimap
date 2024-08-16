import React from "react"
import Navbar from "./Navbar"

const FavoriteLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default FavoriteLayout
