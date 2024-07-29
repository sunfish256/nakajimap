import React from "react"
// import Navbar from "./Navbar"
import { AppBar, Toolbar } from "@mui/material"
import logo from "../assets/nakajimap_logo.png"

const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <img src={logo} alt="ロゴ" style={{ height: 40, marginRight: "auto" }} />
        </Toolbar>
      </AppBar>
      {/* <Navbar /> */}
      <main>{children}</main>
    </div>
  )
}

export default AuthLayout
